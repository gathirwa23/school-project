import { useEffect, useRef } from 'react'
import saloonyLogo from '../assets/images/saloony-logo.jpg'
import '../styles/Landing3DHero.css'


function Landing3DHero() {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const stateRef = useRef({ mounted: false })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // WebGL fallback: if context unavailable, just hide the canvas.
    const gl = canvas.getContext('webgl', { antialias: true, alpha: true })
    if (!gl) {
      canvas.style.display = 'none'
      return
    }

    stateRef.current.mounted = true

    const vertSrc = `
      attribute vec2 aPos;
      varying vec2 vUv;
      void main(){
        vUv = (aPos + 1.0) * 0.5;
        gl_Position = vec4(aPos, 0.0, 1.0);
      }
    `

    const fragSrc = `
      precision mediump float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uRes;

      // simple 2D hash
      float hash(vec2 p){
        p = fract(p*vec2(123.34, 456.21));
        p += dot(p, p+45.32);
        return fract(p.x*p.y);
      }

      float noise(vec2 p){
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f*f*(3.0-2.0*f);
        return mix(a, b, u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
      }

      void main(){
        vec2 uv = vUv;
        // center and correct aspect
        vec2 p = (uv - 0.5);
        p.x *= uRes.x / uRes.y;

        float t = uTime * 0.0006;

        // background glow
        float r = length(p);
        float glow = exp(-3.0*r);

        // pseudo 3D: layered warped rings
        float rings = 0.0;
        float layers = 6.0;
        for(float i=0.0;i<6.0;i++){
          float fi = i;
          float z = fi / (layers-1.0);
          float w = 0.18 + z*0.35;
          vec2 q = p;
          q *= (1.0 + z*0.9);
          q += 0.08*vec2(sin(t*2.2 + fi*2.1), cos(t*1.7 + fi*1.3));
          float ang = atan(q.y, q.x);
          float rad = length(q);
          float n = noise(q*3.0 + t*1.2 + fi*10.0);
          float d = abs(rad - (0.35 + w*sin(ang*3.0 + t + n)));
          float a = smoothstep(0.05, 0.0, d);
          rings += a * (1.0 - z);
        }

        vec3 base1 = vec3(0.98, 0.97, 0.92);
        vec3 base2 = vec3(0.23, 0.43, 0.07);
        vec3 col = mix(base1, base2, 0.22 + 0.55*glow) + vec3(0.12,0.14,0.07)*rings;

        // vignette
        float vig = smoothstep(0.95, 0.2, r);
        col *= (0.55 + 0.45*vig);

        // alpha
        float alpha = 0.85 * vig;
        gl_FragColor = vec4(col, alpha);
      }
    `

    const compile = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        // eslint-disable-next-line no-console
        console.error(gl.getShaderInfoLog(s))
      }
      return s
    }

    const vs = compile(gl.VERTEX_SHADER, vertSrc)
    const fs = compile(gl.FRAGMENT_SHADER, fragSrc)

    const program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)

    gl.useProgram(program)

    const posLoc = gl.getAttribLocation(program, 'aPos')
    const timeLoc = gl.getUniformLocation(program, 'uTime')
    const resLoc = gl.getUniformLocation(program, 'uRes')

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)

    // Fullscreen quad
    const data = new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      -1, 1,
      1, -1,
      1, 1,
    ])

    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(rect.width * dpr))
      canvas.height = Math.max(1, Math.floor(rect.height * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    resize()

    const onResize = () => resize()
    window.addEventListener('resize', onResize)

    const start = performance.now()

    const draw = () => {
      if (!stateRef.current.mounted) return

      const now = performance.now()
      gl.useProgram(program)
      gl.uniform1f(timeLoc, now - start)
      gl.uniform2f(resLoc, canvas.width, canvas.height)

      gl.drawArrays(gl.TRIANGLES, 0, 6)
      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      stateRef.current.mounted = false
      window.removeEventListener('resize', onResize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)

      try {
        gl.deleteProgram(program)
        gl.deleteShader(vs)
        gl.deleteShader(fs)
        gl.deleteBuffer(buf)
      } catch {
        // ignore cleanup failures
      }
    }
  }, [])

  return (
    <div className="landing-hero-3d" aria-hidden="true">
      <canvas ref={canvasRef} className="landing-hero-canvas" />
      <div className="landing-hero-3d-overlay" />

      <div className="landing-hero-3d-card" style={{ transform: 'translateZ(0)' }}>
        <img className="landing-hero-3d-logo" src={saloonyLogo} alt="" />
        <div>
          <div className="landing-hero-3d-title">Shop smarter</div>
          <div className="landing-hero-3d-sub">3D ambient background</div>
        </div>
      </div>
    </div>
  )
}

export default Landing3DHero


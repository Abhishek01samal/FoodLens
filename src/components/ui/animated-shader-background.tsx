import React, { useEffect, useRef, memo } from 'react';
import * as THREE from 'three';

interface AnimatedShaderBackgroundProps {
  className?: string;
}

const AnimatedShaderBackground = memo(({ className }: AnimatedShaderBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float iTime;
        uniform vec2 iResolution;

        #define NUM_OCTAVES 3
        #define NUM_STARS 200.0
        #define STAR_SPEED 0.15

        float rand(vec2 n) {
          return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 u = fract(p);
          u = u*u*(3.0-2.0*u);

          float res = mix(
            mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
            mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
          return res * res;
        }

        float fbm(vec2 x) {
          float v = 0.0;
          float a = 0.3;
          vec2 shift = vec2(100);
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for (int i = 0; i < NUM_OCTAVES; ++i) {
            v += a * noise(x);
            x = rot * x * 2.0 + shift;
            a *= 0.4;
          }
          return v;
        }

        // Star function with more travel distance
        float star(vec2 uv, vec2 pos, float size, float twinkle) {
          float d = length(uv - pos);
          float brightness = size / d;
          brightness *= smoothstep(0.0, 0.02, d);
          brightness *= 0.5 + 0.5 * sin(twinkle);
          return brightness;
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / iResolution.xy;
          vec2 shake = vec2(sin(iTime * 1.2) * 0.005, cos(iTime * 2.1) * 0.005);
          vec2 p = ((gl_FragCoord.xy + shake * iResolution.xy) - iResolution.xy * 0.5) / iResolution.y * mat2(6.0, -4.0, 4.0, 6.0);
          vec2 v;
          vec4 o = vec4(0.0);

          float f = 2.0 + fbm(p + vec2(iTime * 5.0, 0.0)) * 0.5;

          // Aurora effect
          for (float i = 0.0; i < 35.0; i++) {
            v = p + cos(i * i + (iTime + p.x * 0.08) * 0.025 + i * vec2(13.0, 11.0)) * 3.5 + vec2(sin(iTime * 3.0 + i) * 0.003, cos(iTime * 3.5 - i) * 0.003);
            float tailNoise = fbm(v + vec2(iTime * 0.5, i)) * 0.3 * (1.0 - (i / 35.0));
            vec4 auroraColors = vec4(
              0.1 + 0.3 * sin(i * 0.2 + iTime * 0.4),
              0.3 + 0.5 * cos(i * 0.3 + iTime * 0.5),
              0.7 + 0.3 * sin(i * 0.4 + iTime * 0.3),
              1.0
            );
            vec4 currentContribution = auroraColors * exp(sin(i * i + iTime * 0.8)) / length(max(v, vec2(v.x * f * 0.015, v.y * 1.5)));
            float thinnessFactor = smoothstep(0.0, 1.0, i / 35.0) * 0.6;
            o += currentContribution * (1.0 + tailNoise * 0.8) * thinnessFactor;
          }

          // Stars with more travel and density
          float stars = 0.0;
          for (float i = 0.0; i < NUM_STARS; i++) {
            // Create unique star position based on index
            vec2 starSeed = vec2(i * 0.1234, i * 0.5678);
            
            // Star initial position
            float startX = rand(starSeed);
            float startY = rand(starSeed + vec2(1.0, 0.0));
            
            // Direction and speed - increased travel distance
            float angle = rand(starSeed + vec2(2.0, 0.0)) * 6.28318;
            float speed = (0.3 + rand(starSeed + vec2(3.0, 0.0)) * 0.7) * STAR_SPEED;
            
            // Calculate moving position with wrapping - travels across full screen
            float travelDistance = mod(iTime * speed + rand(starSeed + vec2(4.0, 0.0)) * 10.0, 3.0) - 1.0;
            vec2 starPos = vec2(
              mod(startX + cos(angle) * travelDistance + 1.0, 1.0),
              mod(startY + sin(angle) * travelDistance + 1.0, 1.0)
            );
            
            // Star properties
            float size = 0.00015 + rand(starSeed + vec2(5.0, 0.0)) * 0.0004;
            float twinkleSpeed = 2.0 + rand(starSeed + vec2(6.0, 0.0)) * 8.0;
            float twinklePhase = rand(starSeed + vec2(7.0, 0.0)) * 6.28;
            
            stars += star(uv, starPos, size, iTime * twinkleSpeed + twinklePhase);
          }

          // Different star colors
          vec3 starColor = vec3(0.9, 0.95, 1.0);
          
          o = tanh(pow(o / 100.0, vec4(1.6)));
          
          // Add stars to output with subtle color variation
          vec3 finalColor = o.rgb * 0.8 + stars * starColor;
          float alpha = max(o.a * 0.8, stars * 0.8);
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let frameId: number;
    const animate = () => {
      material.uniforms.iTime.value += 0.008;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`fixed inset-0 pointer-events-none ${className || ''}`}
      style={{ zIndex: 0 }}
    />
  );
});

AnimatedShaderBackground.displayName = "AnimatedShaderBackground";

export default AnimatedShaderBackground;

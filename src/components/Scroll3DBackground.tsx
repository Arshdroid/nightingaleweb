import React, { useEffect, useRef } from 'react';

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface Polyhedron {
  vertices: Vec3[];
  edges: [number, number][];
  faces: number[][];
}

function createIcosahedron(radius: number): Polyhedron {
  const t = (1 + Math.sqrt(5)) / 2;
  const raw: [number, number, number][] = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ];
  const vertices = raw.map(([x, y, z]) => {
    const len = Math.hypot(x, y, z);
    return { x: (x / len) * radius, y: (y / len) * radius, z: (z / len) * radius };
  });
  const faces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];
  const edgeSet = new Set<string>();
  const edges: [number, number][] = [];
  for (const [a, b, c] of faces) {
    for (const [u, v] of [[a, b], [b, c], [c, a]]) {
      const key = u < v ? `${u}-${v}` : `${v}-${u}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push([u, v]);
      }
    }
  }
  return { vertices, edges, faces };
}

function createOctahedron(radius: number): Polyhedron {
  const vertices: Vec3[] = [
    { x: 0, y: radius, z: 0 },
    { x: 0, y: -radius, z: 0 },
    { x: radius, y: 0, z: 0 },
    { x: -radius, y: 0, z: 0 },
    { x: 0, y: 0, z: radius },
    { x: 0, y: 0, z: -radius },
  ];
  const faces = [
    [0, 4, 2], [0, 2, 5], [0, 5, 3], [0, 3, 4],
    [1, 2, 4], [1, 5, 2], [1, 3, 5], [1, 4, 3],
  ];
  const edges: [number, number][] = [
    [0, 2], [0, 3], [0, 4], [0, 5],
    [1, 2], [1, 3], [1, 4], [1, 5],
    [2, 4], [4, 3], [3, 5], [5, 2],
  ];
  return { vertices, edges, faces };
}

function createCube(size: number): Polyhedron {
  const s = size / 2;
  const vertices: Vec3[] = [
    { x: -s, y: -s, z: -s }, { x: s, y: -s, z: -s },
    { x: s, y: s, z: -s }, { x: -s, y: s, z: -s },
    { x: -s, y: -s, z: s }, { x: s, y: -s, z: s },
    { x: s, y: s, z: s }, { x: -s, y: s, z: s },
  ];
  const faces = [
    [0, 1, 2, 3], [4, 5, 6, 7],
    [0, 1, 5, 4], [2, 3, 7, 6],
    [0, 3, 7, 4], [1, 2, 6, 5],
  ];
  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ];
  return { vertices, edges, faces };
}

function rotatePoint(p: Vec3, rx: number, ry: number, rz: number): Vec3 {
  // Rotate X
  const cosX = Math.cos(rx);
  const sinX = Math.sin(rx);
  const y1 = p.y * cosX - p.z * sinX;
  const z1 = p.y * sinX + p.z * cosX;

  // Rotate Y
  const cosY = Math.cos(ry);
  const sinY = Math.sin(ry);
  const x2 = p.x * cosY + z1 * sinY;
  const z2 = -p.x * sinY + z1 * cosY;

  // Rotate Z
  const cosZ = Math.cos(rz);
  const sinZ = Math.sin(rz);
  const x3 = x2 * cosZ - y1 * sinZ;
  const y3 = x2 * sinZ + y1 * cosZ;

  return { x: x3, y: y3, z: z2 };
}

export const Scroll3DBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Smoothly interpolated scroll & mouse state
    let targetScroll = 0;
    let currentScroll = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const updateScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetScroll = window.scrollY / maxScroll;
    };
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / width - 0.5) * 2;
      targetMouseY = (e.clientY / height - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 3D objects positioned across the viewport with scroll-driven trajectories
    const icosahedron = createIcosahedron(135);
    const octahedron = createOctahedron(95);
    const cubeA = createCube(110);
    const cubeB = createCube(72);

    // Floating 3D dust/nodes
    const particles: { x: number; y: number; z: number; size: number; speed: number }[] = Array.from(
      { length: 36 },
      (_, i) => ({
        x: ((i * 197) % 1600) - 800,
        y: ((i * 313) % 1200) - 600,
        z: ((i * 131) % 600) - 100,
        size: 1.5 + (i % 3) * 0.9,
        speed: 0.4 + (i % 5) * 0.2,
      })
    );

    const drawPolyhedron = (
      poly: Polyhedron,
      center: Vec3,
      rot: Vec3,
      fillRgba: string,
      strokeRgba: string,
      fov = 720
    ) => {
      const transformed = poly.vertices.map((v) => {
        const r = rotatePoint(v, rot.x, rot.y, rot.z);
        return {
          x: r.x + center.x,
          y: r.y + center.y,
          z: r.z + center.z,
        };
      });

      const projected = transformed.map((p) => {
        const depth = fov + p.z;
        const scale = depth > 40 ? fov / depth : 0.01;
        return {
          x: width / 2 + p.x * scale,
          y: height / 2 + p.y * scale,
          z: p.z,
          scale,
        };
      });

      // Depth-sort faces (painter's algorithm)
      const sortedFaces = poly.faces
        .map((face) => {
          const avgZ = face.reduce((sum, idx) => sum + transformed[idx].z, 0) / face.length;
          return { face, avgZ };
        })
        .sort((a, b) => b.avgZ - a.avgZ);

      ctx.fillStyle = fillRgba;
      for (const { face } of sortedFaces) {
        ctx.beginPath();
        face.forEach((idx, i) => {
          const pt = projected[idx];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.closePath();
        ctx.fill();
      }

      ctx.strokeStyle = strokeRgba;
      ctx.lineWidth = 1;
      for (const [a, b] of poly.edges) {
        const p1 = projected[a];
        const p2 = projected[b];
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    };

    const drawOrbitalRing = (
      radius: number,
      center: Vec3,
      rot: Vec3,
      strokeRgba: string,
      fov = 720
    ) => {
      const segments = 48;
      ctx.strokeStyle = strokeRgba;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const p = rotatePoint(
          { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, z: 0 },
          rot.x,
          rot.y,
          rot.z
        );
        const worldZ = p.z + center.z;
        const scale = fov / Math.max(40, fov + worldZ);
        const sx = width / 2 + (p.x + center.x) * scale;
        const sy = height / 2 + (p.y + center.y) * scale;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
    };

    let rafId = 0;
    let time = 0;

    const render = () => {
      time += prefersReducedMotion ? 0 : 0.006;
      currentScroll += (targetScroll - currentScroll) * 0.08;
      currentMouseX += (targetMouseX - currentMouseX) * 0.06;
      currentMouseY += (targetMouseY - currentMouseY) * 0.06;

      ctx.clearRect(0, 0, width, height);

      const s = currentScroll; // 0..1
      const mx = currentMouseX * 28;
      const my = currentMouseY * 22;

      // 1. Large hero-to-about Icosahedron (travels from right to left as you scroll)
      drawPolyhedron(
        icosahedron,
        {
          x: width * 0.32 - s * width * 0.58 + mx * 1.1,
          y: -height * 0.12 + Math.sin(s * Math.PI * 2) * 90 + my * 1.1,
          z: 80 + Math.cos(s * Math.PI) * 120,
        },
        {
          x: time * 0.5 + s * 4.2 + currentMouseY * 0.25,
          y: time * 0.7 + s * 5.8 + currentMouseX * 0.25,
          z: s * 2.1,
        },
        'rgba(19, 39, 63, 0.045)',
        'rgba(19, 39, 63, 0.22)'
      );

      // 2. Orbital Ring around the Icosahedron path (Red Inferno #4E0000)
      drawOrbitalRing(
        210,
        {
          x: width * 0.32 - s * width * 0.58 + mx * 0.9,
          y: -height * 0.12 + Math.sin(s * Math.PI * 2) * 90 + my * 0.9,
          z: 80 + Math.cos(s * Math.PI) * 120,
        },
        {
          x: 1.1 + s * 2.4 + currentMouseY * 0.2,
          y: 0.4 + time * 0.4 + s * 3.1,
          z: s * 1.5,
        },
        'rgba(78, 0, 0, 0.22)'
      );

      // 3. Octahedron (glides from left to right in mid-scroll - Red Inferno #4E0000)
      drawPolyhedron(
        octahedron,
        {
          x: -width * 0.34 + s * width * 0.62 - mx * 0.8,
          y: height * 0.18 - Math.cos(s * Math.PI * 2) * 80 - my * 0.8,
          z: 140 - s * 160,
        },
        {
          x: -time * 0.6 + s * 5.1,
          y: time * 0.4 + s * 3.7,
          z: time * 0.3 + s * 2.8,
        },
        'rgba(78, 0, 0, 0.045)',
        'rgba(78, 0, 0, 0.24)'
      );

      // 4. Architectural Cube A (deep background, slow rotation - Mystic Navy #13273F)
      drawPolyhedron(
        cubeA,
        {
          x: width * 0.24 - Math.sin(s * Math.PI) * width * 0.22 + mx * 0.5,
          y: height * 0.25 - s * height * 0.35 + my * 0.5,
          z: 240,
        },
        {
          x: 0.6 + s * 3.2 + time * 0.25,
          y: 0.8 + s * 4.4 - time * 0.3,
          z: s * 1.8,
        },
        'rgba(19, 39, 63, 0.03)',
        'rgba(19, 39, 63, 0.16)'
      );

      // 5. Smaller Cube B (foreground accent - Red Inferno #4E0000)
      drawPolyhedron(
        cubeB,
        {
          x: -width * 0.22 + Math.cos(s * Math.PI * 1.5) * 140 - mx * 1.2,
          y: -height * 0.25 + s * height * 0.45 - my * 1.2,
          z: 40 + Math.sin(s * Math.PI * 2) * 60,
        },
        {
          x: time * 0.8 + s * 6.0,
          y: -time * 0.6 + s * 4.5,
          z: s * 3.5,
        },
        'rgba(78, 0, 0, 0.04)',
        'rgba(78, 0, 0, 0.22)'
      );

      // 6. Floating 3D depth particles (Mystic Navy & Red Inferno)
      particles.forEach((p, idx) => {
        ctx.fillStyle = idx % 3 === 0 ? 'rgba(78, 0, 0, 0.26)' : 'rgba(19, 39, 63, 0.22)';
        const py = ((p.y - s * 520 * p.speed + 600) % 1200) - 600;
        const depth = 720 + p.z;
        const scale = 720 / Math.max(80, depth);
        const sx = width / 2 + (p.x + mx * (0.4 * p.speed)) * scale;
        const sy = height / 2 + (py + my * (0.4 * p.speed)) * scale;
        ctx.beginPath();
        ctx.arc(sx, sy, p.size * scale, 0, Math.PI * 2);
        ctx.fill();
      });

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="sticky top-0 pointer-events-none z-10 w-full h-screen -mb-[100vh] block"
    />
  );
};

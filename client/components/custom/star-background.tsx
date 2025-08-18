"use client";

import { Points, PointMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as random from "maath/random";
import { useState, useRef, Suspense } from "react";
import type { Points as PointsType } from "three";

type StarBackgroundProps = {
  props?: Record<string, unknown>;
};

const POINTS = 5000;

export const StarBackground = ({ props }: StarBackgroundProps) => {
  const ref = useRef<PointsType | null>(null);

  // Tạo mảng độ dài POINTS * 3 (x, y, z)
  const [positions] = useState<Float32Array>(() => {
    const arr = new Float32Array(POINTS * 3);
    const filled = random.inSphere(arr, { radius: 1.2 }) as Float32Array; // explicit cast
    // (Tuỳ chọn) Kiểm tra nhanh xem có NaN không
    // for (let i = 0; i < filled.length; i++) {
    //   if (Number.isNaN(filled[i])) {
    //     console.error("NaN at index", i);
    //     break;
    //   }
    // }
    return filled;
  });

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        stride={3}
        positions={positions}  // không bọc lại new Float32Array(...)
        frustumCulled
        {...props}
      >
        <PointMaterial
          transparent
          color="#fff"
          size={0.002}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

export default function StarsCanvas() {
  return (
    <div className="w-full h-auto fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <StarBackground />
        </Suspense>
      </Canvas>
    </div>
  );
}

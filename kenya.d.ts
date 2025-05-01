// kenya.d.ts
declare module 'kenya' {
    export const counties: { name: string; code: string; center: { lat: number; lon: number }; constituencies: any[] }[];
    export const constituencies: { name: string; code: string; center: { lat: number; lon: number }; wards: any[] }[];
  }
  
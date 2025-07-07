import type { Feature } from "geojson";

export interface feature extends Feature {
  name?: string;
  created_at?: string;
  farmer_id?: string;
  segmentation_task_id?: number;
  selected_area_id?: string;
  source_mask_id?: number;
}

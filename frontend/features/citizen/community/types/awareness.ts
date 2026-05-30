export interface AwarenessCategory {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

export interface AwarenessActivity {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
  description: string;
  date: string;
  status: "Active" | "Inactive";
  imageUrl?: string;
}

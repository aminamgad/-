/** بيانات احتياطية عند عدم توفر MongoDB في الواجهة العامة */
export const FALLBACK_DOCTORS = [
  {
    id: "f1",
    name: "د. ليان الراشد",
    specialty: "طب القلب",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 128,
  },
  {
    id: "f2",
    name: "د. عمر السبيعي",
    specialty: "طب الأطفال",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 94,
  },
  {
    id: "f3",
    name: "د. نورة العتيبي",
    specialty: "الجلدية والتجميل",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
    rating: 4.95,
    reviewCount: 210,
  },
] as const;

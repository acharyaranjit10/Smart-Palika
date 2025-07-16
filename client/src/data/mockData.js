// src/data/mockData.js
export const mockCities = [
  { id: 1, name: 'Province 1' },
  { id: 2, name: 'Madhesh' },
  { id: 3, name: 'Bagmati' },
  { id: 4, name: 'Gandaki' },
  { id: 5, name: 'Lumbini' },
  { id: 6, name: 'Karnali' },
  { id: 7, name: 'Sudurpashchim' },
];

export const mockMunicipalities = [
  { id: 1, name: 'Kathmandu', provinceId: 3 },
  { id: 2, name: 'Pokhara', provinceId: 4 },
  { id: 3, name: 'Lalitpur', provinceId: 3 },
  { id: 4, name: 'Bharatpur', provinceId: 3 },
  { id: 5, name: 'Biratnagar', provinceId: 1 },
  { id: 6, name: 'Birgunj', provinceId: 2 },
  { id: 7, name: 'Dharan', provinceId: 1 },
  { id: 8, name: 'Butwal', provinceId: 5 },
  { id: 9, name: 'Nepalgunj', provinceId: 5 },
  { id: 10, name: 'Itahari', provinceId: 1 },
  { id: 11, name: 'Hetauda', provinceId: 3 },
  { id: 12, name: 'Dhangadhi', provinceId: 7 },
];

export const mockWards = [
  { id: 1, number: 1, municipalityId: 1 },
  { id: 2, number: 2, municipalityId: 1 },
  { id: 3, number: 3, municipalityId: 1 },
  { id: 4, number: 4, municipalityId: 1 },
  { id: 5, number: 5, municipalityId: 1 },
  { id: 6, number: 6, municipalityId: 1 },
  { id: 7, number: 7, municipalityId: 1 },
  { id: 8, number: 8, municipalityId: 1 },
  { id: 9, number: 9, municipalityId: 1 },
  { id: 10, number: 10, municipalityId: 1 },
  { id: 11, number: 1, municipalityId: 2 },
  { id: 12, number: 2, municipalityId: 2 },
  { id: 13, number: 3, municipalityId: 2 },
  { id: 14, number: 1, municipalityId: 3 },
  { id: 15, number: 2, municipalityId: 3 },
];

export const mockComplaints = [
  {
    id: 1,
    userId: 1,
    title: "Garbage not collected",
    description: "Garbage hasn't been collected in Ward 5 for 4 days",
    province: "Bagmati",
    municipality: "Kathmandu",
    ward: "Ward 5",
    wardNo: 5,
    date: "2023-06-15T10:30:00Z",
    status: "Resolved",
    statusHistory: [
      { status: "Submitted", date: "2023-06-15T10:30:00Z" },
      { status: "Reviewed", date: "2023-06-16T09:15:00Z" },
      { status: "In Progress", date: "2023-06-16T14:20:00Z" },
      { status: "Resolved", date: "2023-06-18T11:45:00Z" }
    ],
    location: {
      lat: 27.7172,
      lng: 85.3240
    },
    image: null
  },
  {
    id: 2,
    userId: 1,
    title: "Damaged road",
    description: "Large pothole on the main road near Boudhanath Stupa",
    province: "Bagmati",
    municipality: "Kathmandu",
    ward: "Ward 6",
    wardNo: 6,
    date: "2023-07-01T14:22:00Z",
    status: "In Progress",
    statusHistory: [
      { status: "Submitted", date: "2023-07-01T14:22:00Z" },
      { status: "Reviewed", date: "2023-07-02T10:05:00Z" },
      { status: "In Progress", date: "2023-07-03T09:30:00Z" }
    ],
    location: {
      lat: 27.7216,
      lng: 85.3615
    },
    image: null
  },
  {
    id: 3,
    userId: 100,
    title: "Street Light Malfunction",
    description: "Street light not working in Ward 2",
    province: "Bagmati",
    municipality: "Lalitpur",
    ward: "Ward 2",
    wardNo: 2,
    date: "2023-07-10T08:45:00Z",
    status: "Submitted",
    statusHistory: [
      { status: "Submitted", date: "2023-07-10T08:45:00Z" }
    ],
    location: {
      lat: 27.6788,
      lng: 85.3160
    },
    image: null
  },
  {
    id: 4,
    userId: 2,
    title: "Water leakage in park",
    description: "Water pipe leaking in central park, wasting water",
    province: "Bagmati",
    municipality: "Bhaktapur",
    ward: "Ward 3",
    wardNo: 3,
    date: "2023-07-12T11:20:00Z",
    status: "Reviewed",
    statusHistory: [
      { status: "Submitted", date: "2023-07-12T11:20:00Z" },
      { status: "Reviewed", date: "2023-07-13T09:15:00Z" }
    ],
    location: {
      lat: 27.6721,
      lng: 85.4280
    },
    image: null
  },
  {
    id: 5,
    userId: 3,
    title: "Illegal construction",
    description: "Unauthorized construction in residential area",
    province: "Gandaki",
    municipality: "Pokhara",
    ward: "Ward 4",
    wardNo: 4,
    date: "2023-07-11T16:40:00Z",
    status: "In Progress",
    statusHistory: [
      { status: "Submitted", date: "2023-07-11T16:40:00Z" },
      { status: "Reviewed", date: "2023-07-12T10:30:00Z" },
      { status: "In Progress", date: "2023-07-13T14:15:00Z" }
    ],
    location: {
      lat: 28.2096,
      lng: 83.9856
    },
    image: null
  },
  {
    id: 6,
    userId: 4,
    title: "Blocked drainage",
    description: "Drainage system blocked in Ward 5 causing flooding",
    province: "Bagmati",
    municipality: "Kathmandu",
    ward: "Ward 5",
    wardNo: 5,
    date: "2023-07-14T09:30:00Z",
    status: "Submitted",
    statusHistory: [
      { status: "Submitted", date: "2023-07-14T09:30:00Z" }
    ],
    location: {
      lat: 27.7192,
      lng: 85.3268
    },
    image: null
  }
];
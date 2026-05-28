import { Admin } from '@/types';

let mockAdmins: Admin[] = [
  {
    id: 'ADM-101',
    name: 'Alexandra Sterling',
    email: 'a.sterling@imari.finance',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpBxzQWx5aB5IX14gb0OxP751LjgJ6ajyFg07i5D0D3yvVbLIfbuoztpNJyYs09Zf91JX2wwda7WuMytZGPe0TFxyf1gO7OULDhvAg49kgl1RGYMUmLNevQaQdmDE2njrnlOfYwYRuCq8FjoRPs2jfP5CZb8P1BrzXsVTpTX6HJta-9mbEAd_ufNZNlb1Yduw_4IPagkGjfteSg2lX6AGwRi5VN9n9GV3deUXny0i8Qy-4RThGW_cTDm5AlI_XS3OPg0TPvzMkDy0',
    role: 'SUPER',
    lastActive: '2023-10-24 09:42',
    status: 'Active',
  },
  {
    id: 'ADM-102',
    name: 'Marcus Thorne',
    email: 'm.thorne@imari.finance',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVQFvLs9bFvfvQweFxizL3dfLUQux2G_f2zNoXJDzPQygJN--MkRY0wfUVrMLtnpUez0PcstJLSWNDoag-2A8TN53Nmp1KV_Mw1M0-TxkjmF4pky_iw2-z3ynqaliNku9ULwpUyt-hX6bI-D-gxFet3LuTye8_vIqWmIzYbtHAIW8K3anyZLzLmH1CeiBdgtBmmaVHNcYIpxb10vpz30eEs4TNflduT4CQYy8yhSu_8GsLknb-RZGlOFlQfnIFB-KTTYimXJfpmXw',
    role: 'FINANCIAL',
    lastActive: '2023-10-24 14:15',
    status: 'Active',
  },
  {
    id: 'ADM-103',
    name: 'Elena Rodriguez',
    email: 'e.rodriguez@imari.finance',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMpnNEHXxuT3YThj3nH-GiuetVlaeGea9kED2E6rc7kaNt1jwJh-8Dls3J5-6Vl_iv0kTAKgV_6sYTTEmaAyBzbt1OGUJxjyypyVnoXdsHW0MfyRiE3dqvLUKvoqzCJ8Q_rczuqZ0MbLpAtFj_Ik0OY_G0jwDYRLLCqdQt1V_-8HU7Yc22CuQi_ruHvFS2FcOQla6RzsxR0WfpY2YP25NCQWrpwMHlvlaoqbT3FeFf97F01gLJKvw_VK_nvB-fz3wmBVZWkwhOm5I',
    role: 'SUPPORT',
    lastActive: '2023-10-21 18:02',
    status: 'Inactive',
  },
];

export const getAdmins = async (): Promise<Admin[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockAdmins), 200);
  });
};

export const inviteAdmin = async (admin: Omit<Admin, 'id' | 'lastActive' | 'avatar'>): Promise<Admin> => {
  return new Promise((resolve) => {
    const newAdmin: Admin = {
      ...admin,
      id: `ADM-${Math.floor(200 + Math.random() * 800)}`,
      lastActive: 'Pending Invitation',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    };
    mockAdmins = [newAdmin, ...mockAdmins];
    setTimeout(() => resolve(newAdmin), 150);
  });
};

export const deleteAdmin = async (adminId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    mockAdmins = mockAdmins.filter(a => a.id !== adminId);
    setTimeout(() => resolve(true), 150);
  });
};

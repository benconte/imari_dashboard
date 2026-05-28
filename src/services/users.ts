import { User, KYCSubmission } from '@/types';

let mockUsers: User[] = [
  {
    id: 'USR-8492',
    name: 'Adrian Zuniga',
    email: 'adrian.z@imari.finance',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXnSHiQyS46xoRUnp37RJKVBUQTnoqQIYXqpAYi-Amk32rCo1Q2IXJVNQ19CkrDv2h0ZhAPaOj7t5ddgzcM2CKmnyQsAhglHaa-etHS2bznNn_4tle3jse6Ebp6i7CM9ru5udzI_WRa2cshFNlau2RQQhf09P6-reK09voZtA3Y4n4EXcdOF1hWLDnECHk91K7RbAQTFk38mbPj9zErszCZXu1KTimSPpt5hF-jmnqgL_8HPfvtp0gnm7NxT0UgBYfoETKGnTDy48',
    walletBalance: '$12,450.00',
    kycStatus: 'Verified',
    joinDate: 'Oct 12, 2023',
  },
  {
    id: 'USR-2105',
    name: 'Elena Vanya',
    email: 'elena.v@globallink.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3MR5olaCQH-89W9dqICuFf9N9SWAesO7aJT9LqNGto7Owlbfvgo64so_O-xScD3uymFA2R1QZWKgbicEcwecER_pmGUCLlucMKHCK-7iakAZn2KhPwWFHfGZQCnH_ys_-IVCjTXHsEShY0BUqbliWse9s08FleiXEZlU58lvpwtLRdBiTzJWInmzG3tXRlLREMKnBaOgKU3yPzbiHsFtMGI1QbS2jab_Vu7Gxq2oC1NmcAWUHM7h_FIXnZ4AjDwkQsE9rJWiHBoQ',
    walletBalance: '$3,120.45',
    kycStatus: 'Pending',
    joinDate: 'Jan 05, 2024',
  },
  {
    id: 'USR-1182',
    name: 'Marcus Aurel',
    email: 'm.aurel@cryptonode.net',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHOeeY8jMX8uPbFMPcaQdCtmXroommYfCUe-onIFPbAhuc73oRgsEDvYfVgHoFrvmnDNbDE5lHG_UhJ4Vn7dOfRM5bQm5HlCb74ptATC-jE0slw8y_xP2K8xce65Gcga28_E_qr8Ku3BAOWlHye57BJTQAuL3Z-L4v_qQfuDX8-MPmUAxPni1EXzpR7W4Prg23gMqQoows3X9frhHVpfZTYkbZtH8BhmKRcy4eT3038HdO_hGJJ-77V_eYP4fkfAEFy19m08tF2As',
    walletBalance: '$0.00',
    kycStatus: 'Suspended',
    joinDate: 'Nov 22, 2023',
  },
  {
    id: 'USR-9901',
    name: 'Sarah Connor',
    email: 's.connor@sky.net',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABJm-W5mjfODDJqSJeS_emB_plCCQMZ_N0YZA1KJYAQLRtJbRk3LtvviYGuaqwu9MFotdBStEU7z4AhFYHJKBFn9XL2b9FgaBVE8MdnznJwMJHDTuNag8UDqXCTlGygritUuG7zLZ8PWlF8_ilLLJlh-TFrIrcfONifFVWzx9BIliQgBoMh1cZ069nY9p_de222NyAMJlOx1GvKZEs-ODubTf6jH_9KVG-MOUj9aAsTFTBAMOMXTAm5NDf_9ouPTWPmb4VWTOVeLI',
    walletBalance: '$54,200.00',
    kycStatus: 'Verified',
    joinDate: 'Feb 14, 2024',
  },
  {
    id: 'USR-3342',
    name: 'Javier Mendez',
    email: 'j.mendez@fintech.io',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiWjWQs5oARHIS3tZZepdLiu864j7Ad_HaSpB-9HuH8V9Ox8FscLqhE1ANoESXYHdAzJkJofw6lVcLGCHtP0XMXi6BjEglfvG9Q9Z8O6uPtRvqcgavp_ax3u-oIjrrrCO9SxWxpO80IrYNTfQRLKIQ7E99Ji0OoGTFUBQZZIOHqe7AMAfMnRl-j4Q6jGqHUM9ibaETn30QxpxFsoIjJ0ayyxXI44XAqZh9MELNAWqpBtw901CSN0jpPxIy3MKOQNegxE43o2_77Gg',
    walletBalance: '$892.10',
    kycStatus: 'Pending',
    joinDate: 'Mar 01, 2024',
  },
];

let mockKYCQueue: KYCSubmission[] = [
  {
    id: 'KYC-001',
    name: 'Julianne Deauville',
    email: 'julianne.d@example.com',
    avatarCode: 'JD',
    docType: 'Passport',
    submitDate: 'Oct 24, 2023',
    riskScore: 12,
    docNo: 'P-88294411',
    expiryDate: '12 Aug 2028',
    nationality: 'France',
    faceMatchPct: 98,
    docAuthVerified: true,
    noAmlMatches: true,
    idCardUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxmvJGI1OYk7ENYVdJ2mAGUMVC3iReFJYVdkRSqY7k-1hDvvnEN_b9FDNBH9HpC3be6OEiVVDcq_1C-bmmeaxBMSkiuFhNpUL0EbBQUaGpAm6VOPXuSVxwyW2RYhSSAOt7YnXdio1bPSUNIQ_mKh5tVSIJC0ytc7vMfQHf3RsxHrRsM2_v6ZunMxZmbYTQJJSqA5wi92S5wt9aYJUkhzH_Ls68RqDPtjfC7-7ZPot49dRGON_3mqBRvB5LXYtXcEoG3Qs_5ne4b_k',
  },
  {
    id: 'KYC-002',
    name: 'Marcus Kovac',
    email: 'm.kovac@fintech.io',
    avatarCode: 'MK',
    docType: 'ID Card',
    submitDate: 'Oct 24, 2023',
    riskScore: 48,
    docNo: 'ID-99281722',
    expiryDate: '20 Nov 2029',
    nationality: 'Slovakia',
    faceMatchPct: 84,
    docAuthVerified: true,
    noAmlMatches: true,
    idCardUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxmvJGI1OYk7ENYVdJ2mAGUMVC3iReFJYVdkRSqY7k-1hDvvnEN_b9FDNBH9HpC3be6OEiVVDcq_1C-bmmeaxBMSkiuFhNpUL0EbBQUaGpAm6VOPXuSVxwyW2RYhSSAOt7YnXdio1bPSUNIQ_mKh5tVSIJC0ytc7vMfQHf3RsxHrRsM2_v6ZunMxZmbYTQJJSqA5wi92S5wt9aYJUkhzH_Ls68RqDPtjfC7-7ZPot49dRGON_3mqBRvB5LXYtXcEoG3Qs_5ne4b_k',
  },
  {
    id: 'KYC-003',
    name: 'Elena Lindholm',
    email: 'elena.l@global.com',
    avatarCode: 'EL',
    docType: 'Passport',
    submitDate: 'Oct 23, 2023',
    riskScore: 82,
    docNo: 'P-11209322',
    expiryDate: '15 Mar 2031',
    nationality: 'Sweden',
    faceMatchPct: 75,
    docAuthVerified: true,
    noAmlMatches: false,
    idCardUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxmvJGI1OYk7ENYVdJ2mAGUMVC3iReFJYVdkRSqY7k-1hDvvnEN_b9FDNBH9HpC3be6OEiVVDcq_1C-bmmeaxBMSkiuFhNpUL0EbBQUaGpAm6VOPXuSVxwyW2RYhSSAOt7YnXdio1bPSUNIQ_mKh5tVSIJC0ytc7vMfQHf3RsxHrRsM2_v6ZunMxZmbYTQJJSqA5wi92S5wt9aYJUkhzH_Ls68RqDPtjfC7-7ZPot49dRGON_3mqBRvB5LXYtXcEoG3Qs_5ne4b_k',
  },
  {
    id: 'KYC-004',
    name: 'Saito Tanaka',
    email: 's.tanaka@corp.jp',
    avatarCode: 'ST',
    docType: 'ID Card',
    submitDate: 'Oct 23, 2023',
    riskScore: 5,
    docNo: 'ID-44920192',
    expiryDate: '01 Jul 2027',
    nationality: 'Japan',
    faceMatchPct: 99,
    docAuthVerified: true,
    noAmlMatches: true,
    idCardUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxmvJGI1OYk7ENYVdJ2mAGUMVC3iReFJYVdkRSqY7k-1hDvvnEN_b9FDNBH9HpC3be6OEiVVDcq_1C-bmmeaxBMSkiuFhNpUL0EbBQUaGpAm6VOPXuSVxwyW2RYhSSAOt7YnXdio1bPSUNIQ_mKh5tVSIJC0ytc7vMfQHf3RsxHrRsM2_v6ZunMxZmbYTQJJSqA5wi92S5wt9aYJUkhzH_Ls68RqDPtjfC7-7ZPot49dRGON_3mqBRvB5LXYtXcEoG3Qs_5ne4b_k',
  },
];

export const getUsers = async (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockUsers), 200);
  });
};

export const getKYCQueue = async (): Promise<KYCSubmission[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockKYCQueue), 200);
  });
};

export const addUser = async (user: Omit<User, 'id' | 'joinDate' | 'avatar'>): Promise<User> => {
  return new Promise((resolve) => {
    const newUser: User = {
      ...user,
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    };
    mockUsers = [newUser, ...mockUsers];
    setTimeout(() => resolve(newUser), 150);
  });
};

export const updateKYCStatus = async (userId: string, status: 'Verified' | 'Pending' | 'Suspended'): Promise<User | null> => {
  return new Promise((resolve) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.kycStatus = status;
    }
    setTimeout(() => resolve(user || null), 150);
  });
};

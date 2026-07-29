export interface BankItem {
  name: string;
  swiftCode: string;
  country: string;
  countryCode: string;
  category: 'ASEAN - Indonesia' | 'ASEAN - Regional' | 'Asia (China, HK, JP, IN)' | 'Australia & Pasifik' | 'Timur Tengah (Saudi & UAE)';
}

export const TARGET_BANK_DATABASE: BankItem[] = [
  // 🇮🇩 ASEAN - Indonesia Commercial & Syariah
  { name: 'Bank Central Asia (BCA)', swiftCode: 'CENAIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank Mandiri', swiftCode: 'BMRIIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank Negara Indonesia (BNI)', swiftCode: 'BBNIIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank Rakyat Indonesia (BRI)', swiftCode: 'BRINIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank Syariah Indonesia (BSI)', swiftCode: 'BSMDIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'CIMB Niaga', swiftCode: 'BNIAIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank Permata', swiftCode: 'BBBKIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank Danamon', swiftCode: 'BDINIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank Tabungan Negara (BTN)', swiftCode: 'BBAEIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank Maybank Indonesia', swiftCode: 'IBBKIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank OCBC NISP', swiftCode: 'NISPIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank Mega', swiftCode: 'MEGAIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank Panin', swiftCode: 'KNSWIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank KB Bukopin', swiftCode: 'BBKPIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank Sinarmas', swiftCode: 'BSIMIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank Muamalat Indonesia', swiftCode: 'MUAMIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank BTPN / Jenius', swiftCode: 'BTPNIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank UOB Indonesia', swiftCode: 'UOVBIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank DBS Indonesia', swiftCode: 'DBSSIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank HSBC Indonesia', swiftCode: 'HSBCIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },

  // 📲 Digital Banks Indonesia
  { name: 'Bank Jago (Artos)', swiftCode: 'ARTOSIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'blu by BCA Digital', swiftCode: 'BCADIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'SeaBank Indonesia', swiftCode: 'BKEBIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank Neo Commerce (BNC)', swiftCode: 'BYBIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Allo Bank Indonesia', swiftCode: 'HARDIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },

  // 🏢 BPD (Bank Pembangunan Daerah)
  { name: 'Bank DKI Jakarta', swiftCode: 'BDKIIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank BJB (Jawa Barat)', swiftCode: 'BJBKIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank Jateng (Jawa Tengah)', swiftCode: 'BJTGIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank Jatim (Jawa Timur)', swiftCode: 'BJTMIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank Sumut', swiftCode: 'BSMTIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank Sumsel Babel', swiftCode: 'BSSBIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank Kalbar', swiftCode: 'BKALIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank Kaltimtara', swiftCode: 'BKBDIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank Sulselbar', swiftCode: 'BSSLIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank BPD Bali', swiftCode: 'BBLIIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },
  { name: 'Bank Papua', swiftCode: 'BPAPIDJA', country: 'Indonesia', countryCode: 'ID', category: 'ASEAN - Indonesia' },

  // 🇸🇬 🇲🇾 🇹🇭 🇵🇭 🇻🇳 🇧🇳 ASEAN Regional
  { name: 'DBS Bank Singapore', swiftCode: 'DBSSSGSG', country: 'Singapore', countryCode: 'SG', category: 'ASEAN - Regional' },
  { name: 'OCBC Bank Singapore', swiftCode: 'OCBCSGSG', country: 'Singapore', countryCode: 'SG', category: 'ASEAN - Regional' },
  { name: 'UOB Bank Singapore', swiftCode: 'UOVBSGSG', country: 'Singapore', countryCode: 'SG', category: 'ASEAN - Regional' },
  { name: 'Maybank Malaysia', swiftCode: 'MBBEKLMM', country: 'Malaysia', countryCode: 'MY', category: 'ASEAN - Regional' },
  { name: 'CIMB Bank Malaysia', swiftCode: 'CIMBKLMM', country: 'Malaysia', countryCode: 'MY', category: 'ASEAN - Regional' },
  { name: 'Public Bank Malaysia', swiftCode: 'PBBAMKLM', country: 'Malaysia', countryCode: 'MY', category: 'ASEAN - Regional' },
  { name: 'Hong Leong Bank Malaysia', swiftCode: 'HLBBKLMM', country: 'Malaysia', countryCode: 'MY', category: 'ASEAN - Regional' },
  { name: 'RHB Bank Malaysia', swiftCode: 'RHBBKLMM', country: 'Malaysia', countryCode: 'MY', category: 'ASEAN - Regional' },
  { name: 'Bangkok Bank Thailand', swiftCode: 'BKKBTHBK', country: 'Thailand', countryCode: 'TH', category: 'ASEAN - Regional' },
  { name: 'Kasikornbank (KBank) Thailand', swiftCode: 'KASITHBK', country: 'Thailand', countryCode: 'TH', category: 'ASEAN - Regional' },
  { name: 'Siam Commercial Bank (SCB)', swiftCode: 'SICOTHBK', country: 'Thailand', countryCode: 'TH', category: 'ASEAN - Regional' },
  { name: 'Krungthai Bank Thailand', swiftCode: 'KRTHTHBK', country: 'Thailand', countryCode: 'TH', category: 'ASEAN - Regional' },
  { name: 'BDO Unibank Philippines', swiftCode: 'BNORPHMM', country: 'Philippines', countryCode: 'PH', category: 'ASEAN - Regional' },
  { name: 'Bank of the Philippine Islands (BPI)', swiftCode: 'BOPIPHMM', country: 'Philippines', countryCode: 'PH', category: 'ASEAN - Regional' },
  { name: 'Metrobank Philippines', swiftCode: 'MBTCPHMM', country: 'Philippines', countryCode: 'PH', category: 'ASEAN - Regional' },
  { name: 'Vietcombank Vietnam', swiftCode: 'BFTVNAVX', country: 'Vietnam', countryCode: 'VN', category: 'ASEAN - Regional' },
  { name: 'Techcombank Vietnam', swiftCode: 'VTCBNVX', country: 'Vietnam', countryCode: 'VN', category: 'ASEAN - Regional' },
  { name: 'BIDV Vietnam', swiftCode: 'BIDVNVX', country: 'Vietnam', countryCode: 'VN', category: 'ASEAN - Regional' },
  { name: 'Baiduri Bank Brunei', swiftCode: 'BABUBRBS', country: 'Brunei', countryCode: 'BN', category: 'ASEAN - Regional' },
  { name: 'BIBD (Bank Islam Brunei Darussalam)', swiftCode: 'BIBDBRBS', country: 'Brunei', countryCode: 'BN', category: 'ASEAN - Regional' },

  // 🇨🇳 🇭🇰 🇯🇵 🇮🇳 Asia (China, Hongkong, Jepang, India)
  { name: 'Bank of China (BOC)', swiftCode: 'BKCHCNBJ', country: 'China', countryCode: 'CN', category: 'Asia (China, HK, JP, IN)' },
  { name: 'ICBC (Industrial & Commercial Bank of China)', swiftCode: 'ICBKCNBJ', country: 'China', countryCode: 'CN', category: 'Asia (China, HK, JP, IN)' },
  { name: 'China Construction Bank (CCB)', swiftCode: 'PCBCCNBJ', country: 'China', countryCode: 'CN', category: 'Asia (China, HK, JP, IN)' },
  { name: 'Agricultural Bank of China (ABC)', swiftCode: 'ABOCCNBJ', country: 'China', countryCode: 'CN', category: 'Asia (China, HK, JP, IN)' },
  { name: 'Bank of Communications China', swiftCode: 'COMMCNSH', country: 'China', countryCode: 'CN', category: 'Asia (China, HK, JP, IN)' },
  { name: 'HSBC Hong Kong', swiftCode: 'HSBCHKHH', country: 'Hong Kong', countryCode: 'HK', category: 'Asia (China, HK, JP, IN)' },
  { name: 'Hang Seng Bank Hong Kong', swiftCode: 'HASEHKHH', country: 'Hong Kong', countryCode: 'HK', category: 'Asia (China, HK, JP, IN)' },
  { name: 'Bank of East Asia (BEA) Hong Kong', swiftCode: 'BEASHKHH', country: 'Hong Kong', countryCode: 'HK', category: 'Asia (China, HK, JP, IN)' },
  { name: 'Standard Chartered Hong Kong', swiftCode: 'SCBLHKHH', country: 'Hong Kong', countryCode: 'HK', category: 'Asia (China, HK, JP, IN)' },
  { name: 'MUFG Bank Japan', swiftCode: 'BOTKJPJT', country: 'Japan', countryCode: 'JP', category: 'Asia (China, HK, JP, IN)' },
  { name: 'Mizuho Bank Japan', swiftCode: 'MZHUJPJT', country: 'Japan', countryCode: 'JP', category: 'Asia (China, HK, JP, IN)' },
  { name: 'Sumitomo Mitsui Banking Corp (SMBC)', swiftCode: 'SMBCJPJT', country: 'Japan', countryCode: 'JP', category: 'Asia (China, HK, JP, IN)' },
  { name: 'Japan Post Bank', swiftCode: 'JPACJPJT', country: 'Japan', countryCode: 'JP', category: 'Asia (China, HK, JP, IN)' },
  { name: 'Resona Bank Japan', swiftCode: 'DIWAJPJT', country: 'Japan', countryCode: 'JP', category: 'Asia (China, HK, JP, IN)' },
  { name: 'State Bank of India (SBI)', swiftCode: 'SBININBB', country: 'India', countryCode: 'IN', category: 'Asia (China, HK, JP, IN)' },
  { name: 'HDFC Bank India', swiftCode: 'HDFCINBB', country: 'India', countryCode: 'IN', category: 'Asia (China, HK, JP, IN)' },
  { name: 'ICICI Bank India', swiftCode: 'ICICINBB', country: 'India', countryCode: 'IN', category: 'Asia (China, HK, JP, IN)' },
  { name: 'Axis Bank India', swiftCode: 'UTIBINBB', country: 'India', countryCode: 'IN', category: 'Asia (China, HK, JP, IN)' },
  { name: 'Punjab National Bank (PNB India)', swiftCode: 'PUNBINBB', country: 'India', countryCode: 'IN', category: 'Asia (China, HK, JP, IN)' },

  // 🇦🇺 Australia
  { name: 'Commonwealth Bank of Australia (CBA)', swiftCode: 'CTBAAU2S', country: 'Australia', countryCode: 'AU', category: 'Australia & Pasifik' },
  { name: 'ANZ Bank Australia', swiftCode: 'ANZBAU3M', country: 'Australia', countryCode: 'AU', category: 'Australia & Pasifik' },
  { name: 'Westpac Banking Corp', swiftCode: 'WPACAU2S', country: 'Australia', countryCode: 'AU', category: 'Australia & Pasifik' },
  { name: 'National Australia Bank (NAB)', swiftCode: 'NATAAU33', country: 'Australia', countryCode: 'AU', category: 'Australia & Pasifik' },
  { name: 'Macquarie Bank Australia', swiftCode: 'MACQAU2S', country: 'Australia', countryCode: 'AU', category: 'Australia & Pasifik' },

  // 🇸🇦 🇦🇪 Timur Tengah (Arab Saudi & UAE)
  { name: 'Saudi National Bank (SNB Al Ahli)', swiftCode: 'NCBKSAJE', country: 'Saudi Arabia', countryCode: 'SA', category: 'Timur Tengah (Saudi & UAE)' },
  { name: 'Al Rajhi Bank Saudi Arabia', swiftCode: 'RJHISARI', country: 'Saudi Arabia', countryCode: 'SA', category: 'Timur Tengah (Saudi & UAE)' },
  { name: 'Riyad Bank Saudi Arabia', swiftCode: 'RIBLSARI', country: 'Saudi Arabia', countryCode: 'SA', category: 'Timur Tengah (Saudi & UAE)' },
  { name: 'Saudi Awwal Bank (SABB / HSBC Saudi)', swiftCode: 'SABBSAJE', country: 'Saudi Arabia', countryCode: 'SA', category: 'Timur Tengah (Saudi & UAE)' },
  { name: 'Emirates NBD UAE', swiftCode: 'EBILAEAD', country: 'United Arab Emirates', countryCode: 'AE', category: 'Timur Tengah (Saudi & UAE)' },
  { name: 'First Abu Dhabi Bank (FAB UAE)', swiftCode: 'NBADAEAD', country: 'United Arab Emirates', countryCode: 'AE', category: 'Timur Tengah (Saudi & UAE)' },
  { name: 'Abu Dhabi Commercial Bank (ADCB)', swiftCode: 'ADCBAEAA', country: 'United Arab Emirates', countryCode: 'AE', category: 'Timur Tengah (Saudi & UAE)' },
  { name: 'Dubai Islamic Bank (DIB)', swiftCode: 'DIBUAEAD', country: 'United Arab Emirates', countryCode: 'AE', category: 'Timur Tengah (Saudi & UAE)' },
  { name: 'Mashreq Bank UAE', swiftCode: 'MASQAEAD', country: 'United Arab Emirates', countryCode: 'AE', category: 'Timur Tengah (Saudi & UAE)' },

  // 🌏 Wise (Regional Fintech)
  { name: 'Wise (TransferWise)', swiftCode: 'EVBLBEB1', country: 'International', countryCode: 'GLOBAL', category: 'ASEAN - Regional' },
];

export function lookupSwiftCode(query: string): string | null {
  if (!query) return null;
  const clean = query.toLowerCase().trim();
  const match = TARGET_BANK_DATABASE.find(
    (b) => b.name.toLowerCase().includes(clean) || clean.includes(b.name.toLowerCase())
  );
  return match ? match.swiftCode : null;
}

export function searchBankDatabase(query: string, maxResults = 10): BankItem[] {
  if (!query || query.trim().length < 1) {
    return TARGET_BANK_DATABASE.slice(0, maxResults);
  }
  const clean = query.toLowerCase().trim();
  const results = TARGET_BANK_DATABASE.filter(
    (b) =>
      b.name.toLowerCase().includes(clean) ||
      b.swiftCode.toLowerCase().includes(clean) ||
      b.country.toLowerCase().includes(clean) ||
      b.category.toLowerCase().includes(clean)
  );
  return results.slice(0, maxResults);
}

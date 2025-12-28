
import React from 'react';

export const COLORS = {
  primary: '#8b4513', // Brown Scout
  secondary: '#2f4f4f', // Dark Green
  accent: '#daa520', // Golden yellow
  background: '#fdfaf5',
};

export const SCOUT_ROLES = [
  'Pradana',
  'Sekretaris',
  'Bendahara',
  'Seksi Bidang',
  'Anggota Aktif',
  'Pembina'
];

export const SLOGAN = "Suro Diro Jayaningrat Lebur Dening Pangastuti";

export const TRI_SATYA = [
  "Menjalankan kewajibanku terhadap Tuhan, Negara Kesatuan Republik Indonesia dan mengamalkan Pancasila.",
  "Menolong sesama hidup dan ikut serta membangun masyarakat.",
  "Menepati Dasa Darma."
];

export const DASA_DARMA = [
  "Taqwa kepada Tuhan Yang Maha Esa.",
  "Cinta alam dan kasih sayang sesama manusia.",
  "Patriot yang sopan dan kesatria.",
  "Patuh dan suka bermusyawarah.",
  "Rela menolong dan tabah.",
  "Rajin, terampil dan gembira.",
  "Hemat, cermat dan bersahaja.",
  "Disiplin, berani dan setia.",
  "Bertanggung jawab dan dapat dipercaya.",
  "Suci dalam pikiran, perkataan dan perbuatan."
];

export const ScoutLogoIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Fleur-de-lis (World Scout Emblem) Style */}
    <path d="M12,2C11.5,2,11.1,2.4,11.1,2.9c0,0,0,0.1,0,0.1c-0.2,1.3-1,3.4-3.1,5.1C6.6,9.1,4.7,9.3,3,8.4c-0.4-0.2-0.9,0-1,0.4 c-0.1,0.4,0.1,0.8,0.5,1c1.5,0.8,2.7,2.1,3.2,3.8c0.4,1.4,1.3,4.4,4.2,5.2c0.2,0.1,0.5,0,0.7-0.1c0.1-0.1,0.1-0.3,0-0.4 c-0.8-1.1-1.2-2.5-1-3.8c0.2-1.3,1-2.5,2.3-2.5s2.1,1.2,2.3,2.5c0.2,1.3-0.2,2.7-1,3.8c-0.1,0.1-0.1,0.3,0,0.4 c0.2,0.1,0.5,0.2,0.7,0.1c2.9-0.8,3.8-3.8,4.2-5.2c0.5-1.7,1.7-3,3.2-3.8c0.4-0.2,0.6-0.6,0.5-1c-0.1-0.4-0.6-0.6-1-0.4 c-1.7,0.9-3.6,0.7-5.1-0.3c-2.1-1.7-2.9-3.8-3.1-5.1c0,0,0-0.1,0-0.1C12.9,2.4,12.5,2,12,2z M12,20c-1.7,0-3,0.4-3,1s1.3,1,3,1 s3-0.4,3-1S13.7,20,12,20z" />
  </svg>
);

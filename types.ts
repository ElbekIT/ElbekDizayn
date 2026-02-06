
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export enum OrderStatus {
  PENDING = 'Tekshirilyapti',
  CHECKING = 'Tekshirildi',
  CONFIRMED = 'Tastiqlandi'
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhoto: string;
  firstName: string;
  lastName?: string;
  gender: 'Erkak' | 'Ayol';
  phone: string;
  telegramHandle: string;
  designType: 'Banner' | 'Avatar' | 'Preview';
  game: string;
  message: string;
  totalPrice: number;
  promoCode: string;
  status: OrderStatus;
  createdAt: number;
}

export const DESIGN_PRICES = {
  Preview: 100000,
  Banner: 50000,
  Avatar: 25000
};

export const GAMES_LIST = [
  "Minecraft", "CS:GO", "CS 2", "PUBG Mobile", "Standoff 2", "Free Fire", "Dota 2", "Valorant", "GTA V", "Roblox", 
  "Among Us", "Call of Duty", "Apex Legends", "Fortnite", "League of Legends", "Overwatch", "Brawl Stars", "Clash Royale",
  "Clash of Clans", "Genshin Impact", "Mobile Legends", "Rocket League", "Terraria", "Rust", "Phasmophobia", "Elden Ring",
  "World of Tanks", "DayZ", "Rainbow Six Siege", "ARK: Survival Evolved", "The Sims 4", "FIFA 24", "Mortal Kombat 11",
  "Street Fighter 6", "Tekken 7", "Destiny 2", "Dead by Daylight", "Euro Truck Simulator 2", "Left 4 Dead 2", "Hearts of Iron IV",
  "Civilization VI", "Cities: Skylines", "Stardew Valley", "Subnautica", "Cyberpunk 2077", "Red Dead Redemption 2",
  "The Witcher 3", "Forza Horizon 5", "Assasin's Creed", "Far Cry 6", "Hogwarts Legacy", "Starfield", "Baldur's Gate 3",
  "Minecraft Dungeons", "Valorant Mobile", "Warzone", "Dead Island 2", "Sons of the Forest", "Garry's Mod", "Unturned",
  "Squad", "Arma 3", "Assetto Corsa", "BeamNG.drive", "Sea of Thieves", "Team Fortress 2", "Paladins", "Smite",
  "Warframe", "Hearthstone", "Magic: The Gathering", "Legends of Runeterra", "Shadowverse", "Yu-Gi-Oh!", "Pokemon Unite",
  "Zelda: TOTK", "Super Mario Odyssey", "Animal Crossing", "Splatoon 3", "Mario Kart 8", "Super Smash Bros", 
  "Pikmin 4", "Bayonetta 3", "Xenoblade Chronicles", "Kirby", "Final Fantasy XIV", "Diablo IV", "Path of Exile", 
  "Monster Hunter: World", "Nier: Automata", "Devil May Cry 5", "Resident Evil 4", "Ghost of Tsushima", "God of War",
  "Spider-Man 2", "Horizon Forbidden West", "The Last of Us", "Uncharted", "Ratchet & Clank", "Gran Turismo 7"
];

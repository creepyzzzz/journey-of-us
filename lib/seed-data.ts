import { nanoid } from "nanoid";
import { GameContent } from "./types";
import { getUserFingerprint } from "./user-fingerprint";

export const createEmptyGame = (title: string = "Untitled Journey"): GameContent => {
  return {
    id: nanoid(),
    title,
    description: "",
    coverGradient: "linear-gradient(135deg, #fda4af 0%, #d8b4fe 100%)",
    creatorName: "",
    partnerNameHint: "",
    truths: [],
    dares: [],
    secrets: [],
    memories: [],
    romanticSentences: [],
    guessingQuestions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
    published: false,
    visibility: "private",
    creatorFingerprint: getUserFingerprint(),
  };
};

// Helper function to create items with fresh IDs
const createItem = (text: string) => ({ id: nanoid(), text });

const createGuessingQuestion = (label: string, type: "text" | "choice", choices?: string[]) => ({
  id: nanoid(),
  label,
  type,
  choices,
  creatorAnswer: "",
});

export const starterGameContent: Omit<GameContent, "id" | "createdAt" | "updatedAt"> = {
  title: "Humari Journey - Starter Pack",
  description: "Ek khoobsurat romantic journey jo tumhare connection ko aur gehri banaye",
  coverGradient: "linear-gradient(135deg, #fda4af 0%, #d8b4fe 100%)",
  creatorName: "",
  partnerNameHint: "",
  version: 1,
  published: false,
  visibility: "private",
  truths: [
    createItem("Tumne pehli baar mujhse attracted kab feel kiya?"),
    createItem("Meri koi aisi habit jo tum secretly adore karte ho?"),
    createItem("Humare saath ka tumhara favorite memory kya hai?"),
    createItem("Tumne kab realize kiya ki tum mujhse pyaar karne lage ho?"),
    createItem("Main kya karta hun jo tumhe loved feel karata hai?"),
    createItem("Meri koi quality jo tumhe sabse zyada surprise karti hai?"),
    createItem("Kab tum mujhse sabse zyada connected feel karte ho?"),
    createItem("Humare relationship mein tumhe sabse pasand kya hai?"),
  ],
  dares: [
    createItem("5 second ka dramatic movie-style love line record karo"),
    createItem("Abhi sabse bada hug do jo tum de sakte ho"),
    createItem("Ek cheez share karo jo tum hamesha kehna chahte the lekin nahi kehi"),
    createItem("Mera best impression do (lovingly!)"),
    createItem("'Humare song' ka ek line gao (ya banake gao!)"),
    createItem("30 seconds mein mujhse pyaar ki teen cheezein batao"),
    createItem("Humari favorite photo dikhao aur explain karo kyun"),
    createItem("Ek silly dance banao aur saath mein perform karo"),
  ],
  secrets: [
    createItem("Ek silly secret batao jo tumhare partner ko nahi pata"),
    createItem("Koi cheez jo tumne mere liye pretend ki ki tumhe pasand hai?"),
    createItem("Humare future ke baare mein ek dream share karo"),
    createItem("Humare relationship ke baare mein tumhe koi ek fear hai?"),
    createItem("Koi cheez reveal karo jo tumne kabhi kisi ko nahi batayi"),
    createItem("Koi quirky cheez jo tum karte ho jab main around nahi hota?"),
  ],
  memories: [
    createItem("Humari sabse unforgettable date describe karo"),
    createItem("Sabse funny moment jo humne share kiya hai?"),
    createItem("Humare pehle kiss ki story sunao"),
    createItem("Koi chota sa moment jo tumhare liye sab kuch tha?"),
    createItem("Ek time describe karo jab maine tumhe incredibly special feel karaya"),
    createItem("Koi adventure jo tum mere saath relive karna chahte ho?"),
  ],
  romanticSentences: [
    createItem("Tum mere favorite hello aur sabse mushkil goodbye ho"),
    createItem("Tumhare saath har moment ghar aane jaisa lagta hai"),
    createItem("Tum ordinary days ko extraordinary feel karate ho"),
    createItem("Main tumhe choose karta hun, har single day"),
    createItem("Tum mere saath hone wali sabse achhi cheez ho"),
    createItem("Tumse pyaar karna sabse aasan kaam hai jo maine kiya hai"),
    createItem("Tumne mujhe magic mein believe karaya hai phir se"),
    createItem("Mera dil sabse safe tab hai jab woh tumhare paas hai"),
  ],
  guessingQuestions: [
    createGuessingQuestion("Mera favorite color kya hai?", "text"),
    createGuessingQuestion("Main sabse zyada kahan travel karna chahta hun?", "text"),
    createGuessingQuestion("Mera comfort food kya hai?", "text"),
    createGuessingQuestion("Mera love language kya hai?", "choice", ["Words of Affirmation", "Quality Time", "Physical Touch", "Acts of Service", "Receiving Gifts"]),
    createGuessingQuestion("Din ka koi time jab main sabse zyada energetic feel karta hun?", "choice", ["Early Morning", "Mid-Morning", "Afternoon", "Evening", "Late Night"]),
    createGuessingQuestion("Main kahan kiss karna sabse zyada pasand karunga?", "choice", ["Forehead", "Cheek", "Neck", "Lips", "Hand"]),
  ],
};

export const createStarterGame = (): GameContent => {
  return {
    id: nanoid(),
    ...starterGameContent,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    creatorFingerprint: getUserFingerprint(),
  };
};

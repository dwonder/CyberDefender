
import type { Challenge } from './types';

export const WORD_BANK: string[] = [
  'Ransomware', 'Strong Password', 'Spam', 'Phishing',
  'Malware', 'Firewall', 'Encryption', 'Two-Factor Authentication',
  'Software Updates', 'VPN', 'Lock Your Screen', 'Vishing',
  'Social Engineering', 'Business Email Compromise', 'Smishing', 'Password Manager',
  'Clean Desk Policy', 'Public Wi-Fi', 'Malicious USB', 'Data Privacy'
];

export const CHALLENGES: Challenge[] = [
  {
    id: 1,
    text: "Think of our company's network as a fortress. The digital guard at the main gate, who checks all data coming in and going out, is called a [_______].",
    correctAnswer: 'Firewall'
  },
  {
    id: 2,
    text: "You get an urgent email from a delivery service about a package, asking you to click a link. It’s a trick to steal your login info. This sneaky bait is a [_______] attack.",
    correctAnswer: 'Phishing'
  },
  {
    id: 3,
    text: "A villain has put a giant lock on our files, demanding money for the key. This digital kidnapping is called [_______].",
    correctAnswer: 'Ransomware'
  },
  {
    id: 4,
    text: "To log in, you need your password (first key) AND a code from your phone (second key). This double-lock system is [_______].",
    correctAnswer: 'Two-Factor Authentication'
  },
  {
    id: 5,
    text: "We scramble our secret messages into a code so villains can't read them. This is called [_______].",
    correctAnswer: 'Encryption'
  },
  {
    id: 6,
    text: "This is the catch-all name for any nasty software (viruses, spyware, etc.) designed to harm your computer. It's known as [_______].",
    correctAnswer: 'Malware'
  },
  {
    id: 7,
    text: 'Using "Password123" is like leaving your key under the doormat. You need a [_______] with a mix of letters, numbers, and symbols.',
    correctAnswer: 'Strong Password'
  },
  {
    id: 8,
    text: "You get a phone call from someone pretending to be from IT, trying to trick you into giving them your password. This is a phishing attack over the phone, called [_______].",
    correctAnswer: 'Vishing'
  },
  {
    id: 9,
    text: "This is the master art of psychological trickery—hacking people, not computers—to manipulate them into revealing secret information. It's called [_______].",
    correctAnswer: 'Social Engineering'
  },
  {
    id: 10,
    text: "You're at a coffee shop and connect to the free, unsecured [_______]. This is risky, as it's like shouting your secrets in a crowded room.",
    correctAnswer: 'Public Wi-Fi'
  },
  {
    id: 11,
    text: "You receive a text message from your \"bank\" with an urgent warning and a suspicious link. This is a phishing attack sent via SMS, known as [_______].",
    correctAnswer: 'Smishing'
  },
  {
    id: 12,
    text: "An email arrives that looks like it's from our CEO, demanding an urgent and unusual money transfer. This highly targeted scam is a [_______] attack.",
    correctAnswer: 'Business Email Compromise'
  },
  {
    id: 13,
    text: "Your computer politely reminds you to install new system updates. These [_______] are vital because they patch security holes in your fortress walls.",
    correctAnswer: 'Software Updates'
  },
  {
    id: 14,
    text: "Remembering dozens of unique, complex passwords is hard. A [_______] is a secure digital vault that stores them all safely for you.",
    correctAnswer: 'Password Manager'
  },
  {
    id: 15,
    text: "You step away from your desk for a coffee. To prevent anyone from using your computer, the first thing you should do is [_______].",
    correctAnswer: 'Lock Your Screen'
  },
  {
    id: 16,
    text: "You find a USB stick in the parking lot. Plugging it in is a huge risk, as it could be a [_______] drive, loaded with malware by a villain as a trap.",
    correctAnswer: 'Malicious USB'
  },
  {
    id: 17,
    text: "A secure connection tool that lets you build a private, encrypted tunnel to the company network when you're outside the office is called a [_______].",
    correctAnswer: 'VPN'
  },
  {
    id: 18,
    text: "Leaving sensitive documents and password notes on your desk overnight is a security risk. Following a [_______] means all sensitive materials are securely stored away.",
    correctAnswer: 'Clean Desk Policy'
  },
  {
    id: 19,
    text: "Unsolicited and unwanted junk email, often trying to sell you something or lead you to risky websites, is universally known as [_______].",
    correctAnswer: 'Spam'
  },
  {
    id: 20,
    text: "The set of rules and practices that ensure we protect our customers' and employees' personal information (like names, addresses, and phone numbers) falls under our [_______] policy.",
    correctAnswer: 'Data Privacy'
  }
];

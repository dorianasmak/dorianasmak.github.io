const PLAIN = "I'm in my final year of my pre-university education at the Metis Montessori Lyceum in Amsterdam. " + 
"At the beginning of my programming journey, I had the opportunity to explore a lot of different fields and " + 
"cybersecurity was the one that stuck with me the most. I love the puzzle-like nature of it, and how it combines creativity with technical skill. " + 
"I hope to pursue a career in cybersecurity, combining my most favorite subjects and skills, as most fields, including cybersecurity, will eventually shift towards the implementation of artificial intelligence and quantum computing.";

// Decoding functions for the About Me section
function caesarEnc(text, shift = 7) {
    return text.split('').map(c => {
    if (/[a-z]/.test(c)) return String.fromCharCode(((c.charCodeAt(0)-97+shift)%26)+97);
    if (/[A-Z]/.test(c)) return String.fromCharCode(((c.charCodeAt(0)-65+shift)%26)+65);
    return c;
    }).join('');
}
function rot13(t) { 
    return caesarEnc(t, 13); 
}
function atbash(t) {
    return t.split('').map(c => {
    if (/[a-z]/.test(c)) return String.fromCharCode(122-(c.charCodeAt(0)-97));
    if (/[A-Z]/.test(c)) return String.fromCharCode(90-(c.charCodeAt(0)-65));
    return c;
    }).join('');
}
function vigenereEnc(text, key = 'KEY') {
    let ki = 0;
    return text.split('').map(c => {
    if (/[a-zA-Z]/.test(c)) {
        const base = /[a-z]/.test(c) ? 97 : 65;
        const shift = key[ki++ % key.length].toUpperCase().charCodeAt(0) - 65;
        return String.fromCharCode(((c.charCodeAt(0)-base+shift)%26)+base);
    }
    return c;
    }).join('');
}
function toHex(t) { 
    return Array.from(t).map(c => c.charCodeAt(0).toString(16).padStart(2,'0')).join(' '); 
}
function toBinary(t) { 
    return Array.from(t).map(c => c.charCodeAt(0).toString(2).padStart(8,'0')).join(' '); 
}
function toBase64(t) { 
    return btoa(unescape(encodeURIComponent(t))); 
}

const ciphers = {
    caesar:    { fn: t => caesarEnc(t,7), hint: 'Caesar cipher: each letter shifted by 7.' },
    rot13:     { fn: t => rot13(t),       hint: 'ROT13: shift of 13. Apply it twice to undo.' },
    atbash:    { fn: t => atbash(t),      hint: 'Atbash: A <-> Z, B <-> Y, … the alphabet reversed.' },
    vigenere:  { fn: t => vigenereEnc(t), hint: 'Vigenère cipher with key "KEY".' },
    hex:       { fn: t => toHex(t),       hint: 'Hexadecimal: each character as a hex byte.' },
    binary:    { fn: t => toBinary(t),    hint: 'Binary: each character as 8 bits.' },
    base64:    { fn: t => toBase64(t),    hint: 'Base64 encoding: common in web and crypto.' },
    plaintext: { fn: t => t,              hint: 'Plaintext: the original message revealed as-is.' },
};

const SOLUTION = 'plaintext';
let currentCipher = null;
const box = document.getElementById('aboutText');
const hint = document.getElementById('cipherHint');

function scrambleReveal(target, isPlain) {
    if (isPlain) { box.textContent = target; box.classList.add('decrypted'); return; }
    box.classList.remove('decrypted');
    const chars = '!@#$%^&*<>?/|~[]{}0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let steps = 0; const maxSteps = 25;
    const iv = setInterval(() => {
    steps++;
    if (steps >= maxSteps) { clearInterval(iv); box.textContent = target; return; }
    box.textContent = target.split('').map((c,i) => {
        if (!/[a-zA-Z0-9]/.test(c)) return c;
        return steps/maxSteps > i/target.length ? c : chars[Math.floor(Math.random()*chars.length)];
    }).join('');
    }, 25);
}

function renderCipher(key) {
    const isPlain = (key === SOLUTION);
    scrambleReveal(isPlain ? PLAIN : ciphers[key].fn(PLAIN), isPlain);
    hint.textContent = isPlain ? '✓ Decrypted: this is the original plaintext.' : ciphers[key].hint;
    hint.classList.toggle('success', isPlain);
}

const startCipher = 'caesar';
document.querySelectorAll('.cipher-btn').forEach(btn => {
    btn.addEventListener('click', () => {
    currentCipher = btn.dataset.cipher;
    document.querySelectorAll('.cipher-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCipher(currentCipher);
    });
    if (btn.dataset.cipher === startCipher) btn.classList.add('active');
});

currentCipher = startCipher;
renderCipher(startCipher);
hint.textContent = 'One of these will reveal the plaintext. Which one decrypts it?';

// Scroll button
document.getElementById('scrollBtn').addEventListener('click', () => {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
});

// Navigation button
document.getElementById('navToggle').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
});

// Navigation bar active highlighting
document.querySelectorAll('section[id]').forEach(s => {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      document.querySelector(`.nav-link[href="#${s.id}"]`)?.classList.add('active');
    } else if (e.boundingClientRect.top > 0) {
      const links = Array.from(document.querySelectorAll('.nav-link'));
      const idx = links.findIndex(l => l.getAttribute('href') === `#${s.id}`);
      if (idx > 0) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        links[idx - 1].classList.add('active');
      }
    }
  }, { rootMargin: '0px 0px -90% 0px', threshold: 0 }).observe(s);
});
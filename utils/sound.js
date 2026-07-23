export const playSound = (type) => {
  try {
    let src = '';
    switch (type) {
      case 'click':
        src = '/sounds/click.ogg'; // Suara klik tombol Minecraft
        break;
      case 'success':
        src = '/sounds/success.ogg'; // Suara level up / XP orb Minecraft
        break;
      case 'error':
        src = '/sounds/error.ogg'; // Suara villager no / damage
        break;
      case 'pop':
        src = '/sounds/pop.ogg'; // Suara item pop
        break;
      default:
        return;
    }
    
    if (src) {
      const audio = new Audio(src);
      audio.volume = 0.4; // Atur volume
      audio.play().catch(e => {
        // Browser terkadang memblokir autoplay audio jika belum ada interaksi user
        console.log('Autoplay audio diblokir atau file tidak ditemukan:', e);
      });
    }
  } catch (error) {
    console.error('Gagal memutar suara:', error);
  }
};

let revealedCount = 0;
let yaAbrio = false;

// ENLACES OFICIALES DE LA INVITACIÓN
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzO0GlMLX9ki94qsz2YQWPqIYR6OhwAZMnRda5_avjZ9WSKBSnQNdMqbwXXleqd7VBD/exec";
const ALBUM_DRIVE_URL = "https://drive.google.com/drive/folders/1xsQv4PjA7igStJBvLMniBhOlY5hZ9m1I?usp=sharing";

function activarInvitacion() {
    if (yaAbrio) return;
    yaAbrio = true;

    const imgSobre = document.getElementById('imgSobreEstetica');
    const videoSobre = document.getElementById('videoSobre');
    const intro = document.getElementById('contenedor-principal');
    const btnTexto = document.getElementById('btn-toca-abrir');
    const musica = document.getElementById('musicaInvitacion');
    const musicIcon = document.getElementById('music-toggle');

    if (btnTexto) {
        btnTexto.innerHTML = "Abriendo... ✉️";
        btnTexto.style.opacity = "0.7";
    }

    if (musica) {
        musica.currentTime = 0;
        musica.play().catch(e => console.log("Audio play err:", e));
    }
    if (musicIcon) musicIcon.style.display = 'flex';

    if (imgSobre) imgSobre.style.opacity = '0';
    if (videoSobre) {
        videoSobre.style.display = 'block';
        videoSobre.currentTime = 0;
        let playPromise = videoSobre.play();

        const proceder = () => {
            transicionAFinal(intro);
        };

        if (playPromise !== undefined) {
            playPromise.then(() => {
                videoSobre.onended = proceder;
            }).catch(proceder);
        } else {
            videoSobre.onended = proceder;
        }
        setTimeout(proceder, 3500);
    } else {
        transicionAFinal(intro);
    }
}

function transicionAFinal(intro) {
    if (intro) {
        intro.style.transition = "opacity 0.8s ease";
        intro.style.opacity = '0';
    }
    setTimeout(() => {
        if (intro) intro.style.display = 'none';
        const seccionFinal = document.getElementById('seccion-final');
        const videoDeco = document.getElementById('videoDeco');

        if (seccionFinal) seccionFinal.classList.remove('oculto');
        
        if (videoDeco) {
            videoDeco.removeAttribute('loop'); // Se reproduce una sola vez y se congela
            videoDeco.play().catch(e => console.log("Video portada play err:", e));
        }

        window.scrollTo(0, 0);
        iniciarAnimacionesScroll();
        setInterval(actualizarContador, 1000);
        actualizarContador();
    }, 800);
}

function toggleMusic() {
    const musica = document.getElementById('musicaInvitacion');
    const icon = document.getElementById('music-toggle');
    if (!musica || !icon) return;
    if (musica.paused) {
        musica.play();
        icon.innerHTML = '<i class="fa-solid fa-music"></i>';
    } else {
        musica.pause();
        icon.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    }
}

function iniciarAnimacionesScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function revealDate(btn, text) {
  if (!btn.classList.contains('revealed')) {
    btn.innerText = text;
    btn.classList.add('revealed');
    revealedCount++;

    if (revealedCount === 3) {
      const msg = document.getElementById('revealed-date-msg');
      if (msg) msg.classList.add('show-revealed');
    }
  }
}

function actualizarContador() {
   // Fecha de la fiesta: 4 de diciembre de 2026 a las 21:00 hs
   const meta = new Date("2026-12-04T21:00:00").getTime();
   const dif = meta - new Date().getTime();
   if (dif > 0) {
       document.getElementById('days').innerText = Math.floor(dif / 86400000).toString().padStart(2, '0');
       document.getElementById('hours').innerText = Math.floor((dif % 86400000) / 3600000).toString().padStart(2, '0');
       document.getElementById('minutes').innerText = Math.floor((dif % 3600000) / 60000).toString().padStart(2, '0');
       document.getElementById('seconds').innerText = Math.floor((dif % 60000) / 1000).toString().padStart(2, '0');
   }
}

function enviarDeseo() {
    const nameInput = document.getElementById('wishName');
    const textInput = document.getElementById('wishText');
    
    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    if (!name || !text) {
        mostrarToast('Completa tu nombre y mensaje 💕');
        return;
    }

    mostrarToast('Enviando tu deseo... 💌');

    const formData = new URLSearchParams();
    formData.append("nombre", name);
    formData.append("deseo", text);

    fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData
    })
    .then(() => {
        mostrarToast('¡Deseo enviado a Alejandra con éxito! ✨💌');
        nameInput.value = '';
        textInput.value = '';
    })
    .catch(error => {
        console.error("Error:", error);
        mostrarToast('Hubo un error al enviar. Inténtalo de nuevo.');
    });
}

// Vinculación dinámica del botón de Álbum Colectivo con el link de Drive real
document.addEventListener("DOMContentLoaded", () => {
    const btnAlbum = document.querySelector('a[href="https://drive.google.com"]');
    if (btnAlbum) {
        btnAlbum.setAttribute("href", ALBUM_DRIVE_URL);
    }
});

function mostrarToast(txt) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.innerText = txt;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 2800);
  }
}
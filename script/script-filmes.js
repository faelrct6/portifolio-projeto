const API_KEY  = '3fd2be6f0c70a2a598f084ddfb75487c';
    const BASE     = 'https://api.themoviedb.org/3';
    const IMG_BASE = 'https://image.tmdb.org/t/p/';

    const searchInput   = document.getElementById('searchInput');
    const movieSelect   = document.getElementById('movieSelect');
    const loading       = document.getElementById('loading');
    const movieDetail   = document.getElementById('movieDetail');
    const trendingGrid  = document.getElementById('trendingGrid');
    const trendingSect  = document.getElementById('trendingSection');
    const errorMsg      = document.getElementById('errorMsg');

    let searchTimer;

    async function apiFetch(path) {
        const sep = path.includes('?') ? '&' : '?';
        const res = await fetch(`${BASE}${path}${sep}api_key=${API_KEY}&language=pt-BR`);
        if (!res.ok) throw new Error(res.status);
        return res.json();
    }

    function starsHTML(score) {
        const val = (score / 10) * 5;
        let html = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(val)) html += '<span class="star full">★</span>';
            else if (i - 0.5 <= val) html += '<span class="star half">★</span>';
            else html += '<span class="star empty">★</span>';
        }
        return html;
    }

    function gerenciarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Se rolar mais de 40px para baixo, adiciona a classe que esconde a barra
    if (window.scrollY > 40) {
        navbar.classList.add('esconder');
    } else {
        navbar.classList.remove('esconder');
    }
}

    function ratingColor(score) {
        if (score >= 7.5) return '#2dff37';
        if (score >= 6)   return '#417dff';
        if (score >= 5)   return '#f5a623';
        return '#ff5c5c';
    }

    function formatVotes(n) {
        if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
        if (n >= 1000)    return (n / 1000).toFixed(1) + 'K';
        return n;
    }

    function renderDetail(movie) {
        const score     = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
        const scoreNum  = parseFloat(score) || 0;
        const year      = movie.release_date ? movie.release_date.slice(0,4) : '—';
        const genres    = (movie.genres || []).map(g => `<span class="genre-tag">${g.name}</span>`).join('');
        const runtime   = movie.runtime ? `${movie.runtime} min` : '—';
        const budget    = movie.budget > 0 ? '$' + formatVotes(movie.budget) : '—';
        const revenue   = movie.revenue > 0 ? '$' + formatVotes(movie.revenue) : '—';
        const poster    = movie.poster_path
            ? `<img src="${IMG_BASE}w400${movie.poster_path}" alt="${movie.title}" class="detail-poster-img">`
            : `<div class="poster-placeholder">🎬</div>`;

        const scoreColor = ratingColor(scoreNum);

        movieDetail.style.display = 'block';
        trendingSect.style.display = 'none';
        movieDetail.innerHTML = `
        <div class="detail-card">
            <div class="detail-poster" style="background:#111">
                ${movie.poster_path
                    ? `<img src="${IMG_BASE}w400${movie.poster_path}" alt="${movie.title}" style="width:100%;height:100%;object-fit:cover;display:block;">`
                    : `<div class="poster-placeholder">🎬</div>`
                }
            </div>
            <div class="detail-info">
                <div class="detail-header">
                    <div>
                        <div class="detail-title">${movie.title}</div>
                        ${movie.original_title !== movie.title ? `<div class="detail-year" style="font-style:italic;">${movie.original_title}</div>` : ''}
                        <div class="detail-year">${year} ${movie.status ? '· ' + movie.status : ''}</div>
                    </div>
                    <div class="rating-badge">
                        <div class="rating-score" style="color:${scoreColor};text-shadow:0 0 12px ${scoreColor}55">${score}</div>
                        <div class="stars" style="justify-content:center">${starsHTML(scoreNum)}</div>
                        <div class="rating-label">/ 10</div>
                    </div>
                </div>
                ${genres ? `<div class="genres">${genres}</div>` : ''}
                ${movie.overview ? `<p class="overview-text">${movie.overview}</p>` : ''}
                <div class="stats-row">
                    <div class="stat-item">
                        <div class="stat-label">Votos</div>
                        <div class="stat-value">${formatVotes(movie.vote_count || 0)}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Duração</div>
                        <div class="stat-value">${runtime}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Popularidade</div>
                        <div class="stat-value">${movie.popularity ? Math.round(movie.popularity).toLocaleString() : '—'}</div>
                    </div>
                </div>
                <button onclick="backToTrending()" style="
                    margin-top:8px; align-self:flex-start;
                    background:transparent; border:1px solid rgba(65,125,255,0.35);
                    color:#417dff; padding:8px 18px; border-radius:8px; cursor:pointer;
                    font-family:'Inter',sans-serif; font-size:0.85rem;
                    transition:background 0.2s;
                " onmouseover="this.style.background='rgba(65,125,255,0.1)'" onmouseout="this.style.background='transparent'">
                    ← Voltar ao início
                </button>
            </div>
        </div>`;
    }

    async function loadMovieDetail(id) {
        loading.style.display = 'block';
        movieDetail.style.display = 'none';
        errorMsg.style.display = 'none';
        try {
            const data = await apiFetch(`/movie/${id}`);
            loading.style.display = 'none';
            renderDetail(data);
            window.scrollTo({ top: document.getElementById('buscar').offsetTop - 80, behavior: 'smooth' });
        } catch(e) {
            loading.style.display = 'none';
            errorMsg.style.display = 'block';
        }
    }

    function backToTrending() {
        movieDetail.style.display = 'none';
        trendingSect.style.display = 'block';
        movieSelect.value = '';
        searchInput.value = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function buildMovieCard(m) {
        const score = m.vote_average ? m.vote_average.toFixed(1) : '?';
        const color = ratingColor(parseFloat(score));
        const div = document.createElement('div');
        div.className = 'movie-card';
        div.innerHTML = `
            ${m.poster_path
                ? `<img src="${IMG_BASE}w300${m.poster_path}" alt="${m.title}" class="card-poster" loading="lazy">`
                : `<div class="card-poster-placeholder">🎬</div>`
            }
            <div class="card-info">
                <div class="card-title">${m.title}</div>
                <div class="card-score">
                    <span class="score-dot" style="background:${color};box-shadow:0 0 5px ${color}88"></span>
                    <span class="score-num" style="color:${color}">${score}</span>
                    <span class="score-votes">(${formatVotes(m.vote_count || 0)} votos)</span>
                </div>
            </div>`;
        div.addEventListener('click', () => loadMovieDetail(m.id));
        return div;
    }

    async function loadTrending() {
        try {
            const data = await apiFetch('/trending/movie/week');
            const movies = data.results || [];

            trendingGrid.innerHTML = '';
            movies.slice(0, 20).forEach(m => trendingGrid.appendChild(buildMovieCard(m)));

            movieSelect.innerHTML = '<option value="">▾ Selecione um filme em destaque</option>';
            movies.slice(0, 20).forEach(m => {
                const opt = document.createElement('option');
                opt.value = m.id;
                const yr = m.release_date ? ` (${m.release_date.slice(0,4)})` : '';
                const sc = m.vote_average ? ` ★ ${m.vote_average.toFixed(1)}` : '';
                opt.textContent = `${m.title}${yr}${sc}`;
                movieSelect.appendChild(opt);
            });
        } catch(e) {
            errorMsg.style.display = 'block';
        }
    }

    async function handleSearch(query) {
        if (!query.trim()) {
            backToTrending();
            return;
        }
        loading.style.display = 'block';
        movieDetail.style.display = 'none';
        trendingSect.style.display = 'none';
        errorMsg.style.display = 'none';
        try {
            const data = await apiFetch(`/search/movie?query=${encodeURIComponent(query)}`);
            loading.style.display = 'none';
            const results = data.results || [];

            if (results.length === 0) {
                movieDetail.style.display = 'block';
                movieDetail.innerHTML = `<div style="text-align:center;padding:60px 20px;color:#555;">
                    <div style="font-size:2.5rem;margin-bottom:12px">🎬</div>
                    <p>Nenhum filme encontrado para "<strong style="color:#c5c6c7">${query}</strong>".</p>
                    <button onclick="backToTrending()" style="margin-top:16px;background:transparent;border:1px solid rgba(65,125,255,0.35);color:#417dff;padding:8px 18px;border-radius:8px;cursor:pointer;font-family:'Inter',sans-serif;">Voltar</button>
                </div>`;
                return;
            }

            if (results.length === 1) {
                loadMovieDetail(results[0].id);
                return;
            }

            movieDetail.style.display = 'block';
            trendingSect.style.display = 'block';

            const section = document.getElementById('trendingSection');
            section.querySelector('h2').textContent = `Resultados para "${query}"`;
            section.querySelector('.section-badge').textContent = `${results.length} FILMES`;

            trendingGrid.innerHTML = '';
            results.slice(0, 20).forEach(m => trendingGrid.appendChild(buildMovieCard(m)));
            movieDetail.innerHTML = '';

        } catch(e) {
            loading.style.display = 'none';
            errorMsg.style.display = 'block';
        }
    }

    searchInput.addEventListener('input', e => {
        clearTimeout(searchTimer);
        const q = e.target.value.trim();
        if (!q) {
            backToTrending();
            document.getElementById('trendingSection').querySelector('h2').textContent = 'Em Alta Esta Semana';
            document.getElementById('trendingSection').querySelector('.section-badge').textContent = 'TRENDING';
            return;
        }
        searchTimer = setTimeout(() => handleSearch(q), 500);
    });

    movieSelect.addEventListener('change', e => {
        if (e.target.value) loadMovieDetail(e.target.value);
    });

    loadTrending();
    
    window.onscroll = function() {
    gerenciarScroll();
};
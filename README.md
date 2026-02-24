![LiStatsLogo](https://github.com/discrdapp/LiStats/blob/main/logo-dark.png "LiStats Logo")
======

**LiStats** to aplikacja webowa do sprawdzania i porównywania statystyk graczy z platformy FACEIT na podstawie ich SteamID64 z Steam.

Aplikacja umożliwia szybkie wyszukanie gracza, analizę jego statystyk oraz porównywanie wielu profili w jednej tabeli.

---

# 🚀 Funkcjonalności

### 🔎 Wyszukiwanie gracza po SteamID64

### 🔗 Automatyczne wyciąganie ID z linku Steam

### 📊 Wyświetlanie statystyk:

  - ELO i poziom FACEIT

  - K/D Ratio

  - ADR

  - Winrate

  - Headshot %

  - Liczba meczów

  - Win streak

### 📈 Wykres radarowy umiejętności (Chart.js)

### ➕ Dodawanie graczy do tabeli porównawczej

### 🗑 Usuwanie graczy z tabeli

### 🌙 Tryb ciemny / jasny

### 📱 Responsywny layout (Bootstrap 5)

---

# 🛠 Technologie

- HTML5

- CSS3

- JavaScript (ES6)

- jQuery

- Bootstrap 5

- Chart.js

- DataTables

- jQuery Validate

---

# 🌐 API

Aplikacja korzysta z backendu:

    GET https://listats-backend.onrender.com/api/stats/{steamid}

Endpoint zwraca dane gracza oraz jego statystyki FACEIT w formacie JSON

---

# Repozytorium backend

[LiStats Backend](https://github.com/discrdapp/LiStats-backend/)

---

## License

[MIT](https://choosealicense.com/licenses/mit/)

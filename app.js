$(document).ready(function () {
	let currentData = null
	let radarChart = null
	const colors = [
		'#d9dada',
		'#43e168',
		'#43e168',
		'#fccd24',
		'#fccd24',
		'#fccd24',
		'#fccd24',
		'#f86c1f',
		'#f86c1f',
		'#e90326',
	]

	const table = $('#compareTable').DataTable({
		language: { url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/pl.json' },
		dom: 'tp',
		pageLength: 6,
		ordering: true,
	})

	$('#searchForm').validate({
		rules: {
			steamid: { required: true, digits: true, minlength: 17, maxlength: 17 },
		},
		messages: {
			steamid: 'Wpisz poprawne 17-cyfrowe SteamID64',
		},
		errorPlacement: function (error, element) {
			error.appendTo('#error-placeholder')
		},
		submitHandler: function () {
			scanPlayer()
		},
	})

	$('#steamid').on('input paste', function () {
		let val = $(this).val()

		if (val.includes('steamcommunity.com/profiles/')) {
			let match = val.match(/\d{17}/)

			if (match) {
				$(this).val(match[0])

				$(this).css('border-color', 'var(--win-green)')
				setTimeout(() => $(this).css('border-color', ''), 1000)

				$('#searchForm').validate().element('#steamid')
			}
		}
	})

	function scanPlayer() {
		const id = $('#steamid').val()
		$('#profile-card').slideUp(200)
		$('#loader').show()

		$.ajax({
			url: `/api/stats/${id}`,
			method: 'GET',
			success: function (data) {
				currentData = data
				const s = data.faceit.stats
				let elo = data.faceit.elo
				let maxElo = 2000

				let percent = (elo / maxElo) * 100
				percent = Math.min(percent, 100)

				$('#p-nick').text(data.player.nickname)
				$('#p-avatar').attr('src', data.player.avatar)
				$('.p-lvl-wrapper').css('filter', `drop-shadow(0 0 25px ${colors[data.faceit.level - 1]} `)
				$('.p-lvl-wrapper').css('text-shadow', `0 0 25px ${colors[data.faceit.level - 1]}`)
				$('#p-lvl').empty()
				$('#p-lvl').append(
					`<div class="levellvl" style="color: ${colors[data.faceit.level - 1]}">${data.faceit.level}</div>`,
				)
				$('#p-lvl').append(`
					<div class="progress-bar" 
						style="background: conic-gradient(
							${colors[data.faceit.level - 1]} ${percent}%, 
							#1e1e1e ${percent}% 100%
							
						); rotate: 166deg;">
					</div>
				`)
				$('#p-lvl').append('<div class="insidelvl"></div>')
				$('#p-elo').text(data.faceit.elo)
				$('#p-elo-wrapper').css('color', colors[data.faceit.level - 1])

				$('#p-kd').text(s['Average K/D Ratio'])

				const kd = parseFloat(s['Average K/D Ratio'])
				$('#p-kd').css('color', kd >= 1.0 ? '#10b981' : '#ef4444')

				$('#p-adr').text(s['ADR'])
				$('#p-win').text(s['Win Rate %'] + '%')
				$('#p-hs').text(s['Average Headshots %'] + '%')
				$('#p-matches').text(s['Matches'])
				$('#p-streak').text(s['Current Win Streak'])
				$('#p-socials-steam').attr('href', `https://steamcommunity.com/profiles/${id}`)
				$('#p-socials-faceit').attr('href', `https://www.faceit.com/players/${data.faceit.nickname}`)

				updateRadar(s)

				$('#loader').hide()
				$('#profile-card').slideDown(400)
			},
			error: function () {
				$('#loader').hide()
				alert('Błąd! Sprawdź SteamID lub czy gracz ma Faceit.')
			},
		})
	}

	function updateRadar(stats) {
		const ctx = document.getElementById('radarChart').getContext('2d')

		const win = parseFloat(stats['Win Rate %']) || 50
		const hs = parseFloat(stats['Average Headshots %']) || 30
		const util = (parseFloat(stats['Utility Success Rate']) || 0) * 100
		const entry = (parseFloat(stats['Entry Success Rate']) || 0) * 100
		let kdScore = (parseFloat(stats['Average K/D Ratio']) || 1) * 50
		if (kdScore > 100) kdScore = 100

		const gridColor = $('body').hasClass('light-mode') ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'
		const textColor = $('body').hasClass('light-mode') ? '#333' : '#fff'

		if (radarChart) radarChart.destroy()

		radarChart = new Chart(ctx, {
			type: 'radar',
			data: {
				labels: ['WINRATE', 'AIM (HS)', 'UTILITY', 'ENTRY', 'IMPACT (K/D)'],
				datasets: [
					{
						label: 'Umiejętności',
						data: [win, hs, util, entry, kdScore],
						backgroundColor: 'rgba(255, 85, 0, 0.2)',
						borderColor: '#ff5500',
						borderWidth: 2,
						pointBackgroundColor: '#fff',
						pointBorderColor: '#ff5500',
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					r: {
						min: 0,
						max: 100,
						ticks: { display: false },
						grid: { color: gridColor },
						angleLines: { color: gridColor },
						pointLabels: {
							color: textColor,
							font: { family: 'Rajdhani', size: 12, weight: 'bold' },
						},
					},
				},
				plugins: { legend: { display: false } },
			},
		})
	}

	$('#addToListBtn').click(function () {
		if (!currentData) return

		$(this).animate({ opacity: 0.7 }, 100).animate({ opacity: 1 }, 100)

		const s = currentData.faceit.stats

		table.row
			.add([
				`<div class="d-flex align-items-center fw-bold">
                <img src="${currentData.player.avatar}" class="table-avatar">
                ${currentData.player.nickname}
             </div>`,
				`<span class="badge text-dark" style="background-color:${colors[currentData.faceit.level - 1]};">${currentData.faceit.elo}</span>`,
				s['Average K/D Ratio'],
				s['ADR'],
				`<span class="${parseInt(s['Win Rate %']) > 50 ? 'text-success' : 'text-danger'}">${s['Win Rate %']}%</span>`,
				`<button class="action-btn delete-btn" title="Usuń"><i class="fa-solid fa-trash"></i></button>`,
			])
			.draw(false)
	})

	$('#compareTable tbody').on('click', '.delete-btn', function () {
		const row = table.row($(this).parents('tr'))
		row.remove().draw()
	})

	$('#themeToggle').click(function () {
		$('body').toggleClass('light-mode')
		const isLight = $('body').hasClass('light-mode')

		$(this).html(isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>')

		if (isLight) {
			$('#compareTable').removeClass('table-dark')
			$('#logo').attr('src', 'logo-light.png')
			$('#favicon').attr('href', 'logo-light-small.png')
		} else {
			$('#compareTable').addClass('table-dark')
			$('#logo').attr('src', 'logo-dark.png')
			$('#favicon').attr('href', 'logo-dark-small.png')

		}

		if (currentData) {
			updateRadar(currentData.faceit.stats)
		}
	})
})

/*
 * Live2D Widget
 * https://github.com/stevenjoezhang/live2d-widget
 */

function loadWidget(config) {
	let { waifuPath, apiPath, cdnPath } = config;
	let useCDN = false, modelList;
	if (typeof cdnPath === "string") {
		useCDN = true;
		if (!cdnPath.endsWith("/")) cdnPath += "/";
	}
	if (!apiPath.endsWith("/")) apiPath += "/";
	localStorage.removeItem("waifu-display");
	sessionStorage.removeItem("waifu-text");
	document.body.insertAdjacentHTML("beforeend", `<div id="waifu">
			<div id="waifu-tips"></div>
			<canvas id="live2d" width="280" height="260"></canvas>
			<div id="waifu-tool">
				<span class="fa fa-lg fa-comment"></span>
				<span class="fa fa-lg fa-paper-plane"></span>
				<span class="fa fa-lg fa-user-circle"></span>
				<span class="fa fa-lg fa-street-view"></span>
				<span class="fa fa-lg fa-times"></span>
			</div>
		</div>`);
		/*
		<span class="fa fa-lg fa-camera-retro"></span>
		<span class="fa fa-lg fa-info-circle"></span>*/
	// https://stackoverflow.com/questions/24148403/trigger-css-transition-on-appended-element
	setTimeout(() => {
		document.getElementById("waifu").style.bottom = 0;
	}, 0);

	(function registerEventListener() {
		document.querySelector("#waifu-tool .fa-comment").addEventListener("click", showHitokoto);
		document.querySelector("#waifu-tool .fa-paper-plane").addEventListener("click", () => {
			if (window.Asteroids) {
				if (!window.ASTEROIDSPLAYERS) window.ASTEROIDSPLAYERS = [];
				window.ASTEROIDSPLAYERS.push(new Asteroids());
			} else {
				var script = document.createElement("script");
				script.src = "../../../../../live2d/asteroids.js";
				document.head.appendChild(script);
			}
		});
		document.querySelector("#waifu-tool .fa-user-circle").addEventListener("click", loadOtherModel);
		document.querySelector("#waifu-tool .fa-street-view").addEventListener("click", loadRandModel);
		/*document.querySelector("#waifu-tool .fa-camera-retro").addEventListener("click", () => {
			showMessage("잘 찍혔어요？ 귀엽죠!", 6000, 9);
			Live2D.captureName = "photo.png";
			Live2D.captureFrame = true;
		});
		document.querySelector("#waifu-tool .fa-info-circle").addEventListener("click", () => {
			open("https://github.com/stevenjoezhang/live2d-widget");
		});*/
		document.querySelector("#waifu-tool .fa-times").addEventListener("click", () => {
			localStorage.setItem("waifu-display", Date.now());
			showMessage("나중에 다시 만나요!", 2000, 11);
			document.getElementById("waifu").style.bottom = "-500px";
			setTimeout(() => {
				document.getElementById("waifu").style.display = "none";
				document.getElementById("waifu-toggle").classList.add("waifu-toggle-active");
			}, 3000);
		});
		var devtools = () => {};
		console.log("%c", devtools);
		devtools.toString = () => {
			showMessage("콘솔을 열고싶어요? 제 작은 비밀이에요!", 6000, 9);
		};
		window.addEventListener("copy", () => {
			showMessage("복사할때는 출처를 표시해주세요！", 6000, 9);
		});
		window.addEventListener("visibilitychange", () => {
			if (!document.hidden) showMessage("와! 드디어 돌아왔어요!", 6000, 9);
		});
	})();

	(function welcomeMessage() {
		var text;
		if (location.pathname === "/") { // 如果是主页
			var now = new Date().getHours();
			if (now > 5 && now <= 7) text = "좋은 아침이에요! 오늘도 행복하세요!";
			else if (now > 7 && now <= 11) text = "좋은 아침! 오래 앉아있지 말고 스트래칭하세요！";
			else if (now > 11 && now <= 13) text = "드디어 점심시간이네요！";
			else if (now > 13 && now <= 17) text = "오후엔 졸리기 쉬운데... 집중!";
			else if (now > 17 && now <= 19) text = "저녁 무렵! 창 밖 석양의 경치가 아름답네요!";
			else if (now > 19 && now <= 21) text = "좋은 저녁이에요! 잘 지냈죠?";
			else if (now > 21 && now <= 23) text = ["벌써 늦었네요 일찍 쉬세요! 잘자요~", "밤에는 시력을 조심하세요!"];
			else text = "올빼미에요? 이렇게 늦게 주무시다니...";
		} else if (document.referrer !== "") {
			var referrer = new URL(document.referrer),
				domain = referrer.hostname.split(".")[1];
			if (location.hostname == referrer.hostname) {
				t = document.title.split(" - ")[0];

				if(t.length > 20)
					t = t.substr(0, 20) + "...";

				text = `<span>「${t}」</span>에 온걸 환영해요!`;
			}
			else if (domain == "baidu") text = `Hello！来自 百度搜索 的朋友<br>你是搜索 <span>${referrer.search.split("&wd=")[1].split("&")[0]}</span> 找到的我吗？`;
			else if (domain == "so") text = `Hello！来自 360搜索 的朋友<br>你是搜索 <span>${referrer.search.split("&q=")[1].split("&")[0]}</span> 找到的我吗？`;
			else if (domain == "google") text = `Hello！Google!<br>환영해요!<br><span>「${document.title.split(" - ")[0]}」</span>`;
			else text = `Hello! <span>${referrer.hostname}</span>!`;
		} else {
			t = document.title.split(" - ")[0];

			if(t.length > 20)
				t = t.substr(0, 20) + "...";

			text = `<span>「${t}」</span>에 온걸 환영해요!`;
		}
		showMessage(text, 7000, 8);
	})();
	function randomSelection(obj) {
		return Array.isArray(obj) ? obj[Math.floor(Math.random() * obj.length)] : obj;
	}

	var userAction = false,
		userActionTimer,
		messageTimer,
		messageArrays = ["오랫만에 좋은날이에요!", "역시 자바보단 코틀린이죠", "빨리 코딩해요!", "늘 파이팅하세요!", "Adblock에 화이트리스트로 추가하는걸 잊지마요!", "으악 5중 for문이라니!", "두뇌 풀가동!", "이걸 코드라고 짜놓았다고?", "그뭔씹;", "count sort를 65536진법으로 하면<br>정렬이 O(N)이래요!", "맞왜틀!", "틀왜맞!", "11차원 토마토라고요?", "EZ~", "곱셈을 FFT로?!"];
;
	window.addEventListener("mousemove", () => userAction = true);
	window.addEventListener("keydown", () => userAction = true);
	setInterval(() => {
		if (userAction) {
			userAction = false;
			clearInterval(userActionTimer);
			userActionTimer = null;
		} else if (!userActionTimer) {
			userActionTimer = setInterval(() => {
				showMessage(randomSelection(messageArrays), 6000, 9);
			}, 20000);
		}
	}, 1000);

	function showHitokoto() {
		// 增加 hitokoto.cn 的 API
		showMessage(randomSelection(messageArrays), 6000, 9);
	}

	function showMessage(text, timeout, priority) {
		if (!text) return;
		if (!sessionStorage.getItem("waifu-text") || sessionStorage.getItem("waifu-text") <= priority) {
			if (messageTimer) {
				clearTimeout(messageTimer);
				messageTimer = null;
			}
			text = randomSelection(text);
			sessionStorage.setItem("waifu-text", priority);
			var tips = document.getElementById("waifu-tips");
			tips.innerHTML = text;
			tips.classList.add("waifu-tips-active");
			messageTimer = setTimeout(() => {
				sessionStorage.removeItem("waifu-text");
				tips.classList.remove("waifu-tips-active");
			}, timeout);
		}
	}

	(function initModel() {
		var modelId = localStorage.getItem("modelId"),
			modelTexturesId = localStorage.getItem("modelTexturesId");
		if (modelId == null) {
			// 首次访问加载 指定模型 的 指定材质
			var modelId = 1, // 模型 ID
				modelTexturesId = 53; // 材质 ID
		}
		loadModel(modelId, modelTexturesId);
		fetch(waifuPath)
			.then(response => response.json())
			.then(result => {
				result.mouseover.forEach(tips => {
					window.addEventListener("mouseover", event => {
						if (!event.target.matches(tips.selector)) return;
						var text = randomSelection(tips.text);
						text = text.replace("{text}", event.target.innerText);
						showMessage(text, 4000, 8);
					});
				});
				result.click.forEach(tips => {
					window.addEventListener("click", event => {
						if (!event.target.matches(tips.selector)) return;
						var text = randomSelection(tips.text);
						text = text.replace("{text}", event.target.innerText);
						showMessage(text, 4000, 8);
					});
				});
				result.seasons.forEach(tips => {
					var now = new Date(),
						after = tips.date.split("-")[0],
						before = tips.date.split("-")[1] || after;
					if ((after.split("/")[0] <= now.getMonth() + 1 && now.getMonth() + 1 <= before.split("/")[0]) && (after.split("/")[1] <= now.getDate() && now.getDate() <= before.split("/")[1])) {
						var text = randomSelection(tips.text);
						text = text.replace("{year}", now.getFullYear());
						//showMessage(text, 7000, true);
						messageArray.push(text);
					}
				});
			});
	})();

	async function loadModelList() {
		let response = await fetch(`${cdnPath}model_list.json`);
		let result = await response.json();
		modelList = result;
	}

	async function loadModel(modelId, modelTexturesId, message) {
		localStorage.setItem("modelId", modelId);
		localStorage.setItem("modelTexturesId", modelTexturesId);
		showMessage(message, 4000, 10);
		if (useCDN) {
			if (!modelList) await loadModelList();
			let target = randomSelection(modelList.models[modelId]);
			loadlive2d("live2d", `${cdnPath}model/${target}/index.json`);
		} else {
			loadlive2d("live2d", `${apiPath}get/?id=${modelId}-${modelTexturesId}`);
			console.log(`Live2D 模型 ${modelId}-${modelTexturesId} 加载完成`);
		}
	}

	async function loadRandModel() {
		var modelId = localStorage.getItem("modelId"),
			modelTexturesId = localStorage.getItem("modelTexturesId");
		if (useCDN) {
			if (!modelList) await loadModelList();
			let target = randomSelection(modelList.models[modelId]);
			loadlive2d("live2d", `${cdnPath}model/${target}/index.json`);
			showMessage("새 옷 예쁘죠？", 4000, 10);
		} else {
			// 可选 "rand"(随机), "switch"(顺序)
			fetch(`${apiPath}rand_textures/?id=${modelId}-${modelTexturesId}`)
				.then(response => response.json())
				.then(result => {
					if (result.textures.id == 1 && (modelTexturesId == 1 || modelTexturesId == 0)) showMessage("전 아직 다른 옷이 없어요！", 4000, 10);
					else loadModel(modelId, result.textures.id, "새 옷 예쁘죠？");
				});
		}
	}

	async function loadOtherModel() {
		var modelId = localStorage.getItem("modelId");
		if (useCDN) {
			if (!modelList) await loadModelList();
			let index = (++modelId >= modelList.models.length) ? 0 : modelId;
			loadModel(index, 0, modelList.messages[index]);
		} else {
			fetch(`${apiPath}switch/?id=${modelId}`)
				.then(response => response.json())
				.then(result => {
					loadModel(result.model.id, 0, result.model.message);
				});
		}
	}
}

function initWidget(config, apiPath = "/") {
	if (typeof config === "string") {
		config = {
			waifuPath: config,
			apiPath
		};
	}
	document.body.insertAdjacentHTML("beforeend", `<div id="waifu-toggle">
			<span>...</span>
		</div>`);
	var toggle = document.getElementById("waifu-toggle");
	toggle.addEventListener("click", () => {
		toggle.classList.remove("waifu-toggle-active");
		if (toggle.getAttribute("first-time")) {
			loadWidget(config);
			toggle.removeAttribute("first-time");
		} else {
			localStorage.removeItem("waifu-display");
			document.getElementById("waifu").style.display = "";
			setTimeout(() => {
				document.getElementById("waifu").style.bottom = 0;
			}, 0);
		}
	});
	if (localStorage.getItem("waifu-display") && Date.now() - localStorage.getItem("waifu-display") <= 86400000) {
		toggle.setAttribute("first-time", true);
		setTimeout(() => {
			toggle.classList.add("waifu-toggle-active");
		}, 0);
	} else {
		loadWidget(config);
	}
}

		const BLOGGER_FEED_URL =
			"https://www.ajtravelinn.com/feeds/posts/default";

		let travelPosts = [];
		let feedLoaded = false;
		let feedLoading = false;

		const travelInput = document.getElementById("travelSearch");
		const travelResults = document.getElementById("travelSearchResults");

		// Load Blogger posts using JSONP
		function loadTravelPosts() {

			if (feedLoaded || feedLoading) return;

			feedLoading = true;

			const callbackName = "ajtiBloggerCallback";

			const script = document.createElement("script");

			const params = new URLSearchParams({
				alt: "json-in-script",
				"max-results": "150",
				callback: callbackName
			});

			script.src = BLOGGER_FEED_URL + "?" + params.toString();

			const timeout = setTimeout(() => {
				if (feedLoading) {
					feedLoading = false;
					delete window[callbackName];
					script.remove();
					showTravelMessage("Unable to load articles. Please try again.");
				}
			}, 15000);

			window[callbackName] = function(data) {

				clearTimeout(timeout);

				const entries = data?.feed?.entry || [];

				travelPosts = entries.map(post => {

					const title = post.title?.$t || "";

					const link = post.link?.find(
						item => item.rel === "alternate"
					)?.href || "";

					const content = post.summary?.$t ||
									post.content?.$t || "";

					const parser = new DOMParser();
					const doc = parser.parseFromString(
						content, "text/html"
					);

					const description = (
						doc.body.textContent || ""
					).trim().replace(/\s+/g, " ");

					const image = post.media$thumbnail?.url ||
						doc.querySelector("img")?.src ||
						"";

					const labels = (post.category || [])
						.map(category => category.term);

					return {
						title,
						link,
						description,
						image,
						labels
					};

				}).filter(post => post.title && post.link);

				feedLoaded = true;
				feedLoading = false;

				delete window[callbackName];
				script.remove();

				// Show suggestions if visitor already typed something
				if (travelInput.value.trim()) {
					showTravelSuggestions(travelInput.value);
				}
			};

			script.onerror = function() {
				clearTimeout(timeout);
				feedLoading = false;
				delete window[callbackName];
				script.remove();
				showTravelMessage("Could not connect to Blogger.");
			};

			document.body.appendChild(script);
		}


		// Display matching posts
		function showTravelSuggestions(query) {

			const searchTerm = query.trim().toLowerCase();

			travelResults.replaceChildren();

			if (!searchTerm) {
				travelResults.hidden = true;
				return;
			}

			if (!feedLoaded) {
				showTravelMessage("Loading travel guides...");
				loadTravelPosts();
				return;
			}

			const matches = travelPosts.filter(post => {

				const searchableText = [
					post.title,
					post.description,
					...post.labels
				].join(" ").toLowerCase();

				return searchableText.includes(searchTerm);

			}).slice(0, 7);

			if (!matches.length) {
				showTravelMessage("No matching travel guides found.");
				return;
			}

			matches.forEach(post => {

				const link = document.createElement("a");
				link.className = "travel-result-item";
				link.href = post.link;
				link.target = "_self";

				if (post.image) {
					const image = document.createElement("img");
					image.src = post.image;
					image.alt = "";
					image.loading = "lazy";
					link.appendChild(image);
				}

				const info = document.createElement("div");
				info.className = "travel-result-info";

				const title = document.createElement("strong");
				title.textContent = post.title;

				const category = document.createElement("small");
				category.textContent = post.labels.slice(0, 2).join(" • ")
					|| "Travel Guide";

				info.append(title, category);
				link.appendChild(info);

				travelResults.appendChild(link);
			});

			travelResults.hidden = false;
		}


		// Display messages
		function showTravelMessage(message) {

			travelResults.replaceChildren();

			const messageElement = document.createElement("div");
			messageElement.className = "travel-search-message";
			messageElement.textContent = message;

			travelResults.appendChild(messageElement);
			travelResults.hidden = false;
		}


		// Live search event
		travelInput.addEventListener("input", function() {
			showTravelSuggestions(this.value);
		});


		// Search button action
		function searchTravel() {

			const query = travelInput.value.trim();

			if (!query) {
				travelInput.focus();
				return;
			}

			// Use Blogger's native search for the full results page
			window.location.href =
				"https://www.ajtravelinn.com/search?q=" +
				encodeURIComponent(query);
		}


		// Close suggestions when clicking outside
		document.addEventListener("click", function(event) {

			if (!event.target.closest(".travel-search-wrapper")) {
				travelResults.hidden = true;
			}

		});


		// Load Blogger posts when homepage loads
		loadTravelPosts();

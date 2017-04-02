var VibeJs = {

	testingButtonState : "ready",
	theme              : "blue",
	widgetContainer    : null,
	widget             : null,
	highlightedElement : null,
	ratingForm         : null,
	commentButton      : null,
	commentText        : null,
	dashboardLauncher  : null,
	targetElements     : ["DIV", "SPAN", "CANVAS"],

	DrawWidget       : function()
	{
		VibeJs.Utilities.PreloadImages (
		[
			"vibe.js/talk.png",
			"vibe.js/record.png",
			"vibe.js/pause.png",
			"vibe.js/star.png",
			"vibe.js/disabledstar.png",
			"vibe.js/star.png",
			"vibe.js/write.png",
			"vibe.js/dashboard.png",
			"vibe.js/page.png",
			"vibe.js/open.png",
			"vibe.js/back.png"
		]);

		this.widgetContainer = document.querySelectorAll ("vibejs")[0];
		this.widget = document.createElement ("div");
		this.widget.className = "vibeJsWidget " + this.theme;
		this.widgetContainer.appendChild (this.widget);

		document.addEventListener ("mouseover", function (event)
		{
			if (VibeJs.testingButtonState == "pause")
			{
				VibeJs.HighlightElement (event.target);
			}
		});

		this.widget.addEventListener ("click", function (event)
		{
			VibeJs.highlightedElement = null;

			if (VibeJs.Dashboard.workspaceView == true)
			{
				event.preventDefault();
				return;
			}

			switch (VibeJs.testingButtonState)
			{
				case "ready":
					VibeJs.Dashboard.DrawDashboardLauncher();
					VibeJs.widget.style.backgroundImage = 'url("vibe.js/record.png")';
					VibeJs.testingButtonState = "record";
					break;

				case "record":
					if (VibeJs.dashboardLauncher)
					{
						VibeJs.dashboardLauncher.parentElement.removeChild (VibeJs.dashboardLauncher);
						VibeJs.dashboardLauncher = null;
					}

					VibeJs.widget.style.backgroundImage = 'url("vibe.js/pause.png")';
					VibeJs.testingButtonState = "pause";
					break;

				case "pause":
					VibeJs.Dashboard.DrawDashboardLauncher();
					VibeJs.widget.style.backgroundImage = 'url("vibe.js/record.png")';
					VibeJs.Persist.currentRecording = VibeJs.Persist.CreateRecording();
					VibeJs.testingButtonState = "record";

				default :
					VibeJs.Dashboard.DrawDashboardLauncher();
					VibeJs.widget.style.backgroundImage = 'url("vibe.js/record.png")';
					VibeJs.testingButtonState = "record";
					break;
			}
		});
	},

	DrawRatingForm   : function (element)
	{
		var ratingFormsOnPage = document.querySelectorAll (".ratingForm");

		for (var ratingForm in ratingFormsOnPage)
		{
			if (ratingFormsOnPage[ratingForm].parentElement)
			{
				ratingFormsOnPage[ratingForm].parentElement.removeChild (ratingFormsOnPage[ratingForm]);
			}
		}

		var ratingForm = document.createElement ("div");
		ratingForm.className = "ratingForm";
		ratingForm.style.zIndex = "1979";
		ratingForm.style.float = "right";
		element.insertBefore (ratingForm, element.firstChild);

		VibeJs.DrawStarBar (ratingForm);
		VibeJs.ratingForm = ratingForm;
	},

	DrawStarBar      : function (element)
	{
		var starBar = document.createElement ("div");
		starBar.className = "starBar";

		for (count = 1; count <= 5; count++)
		{
			var starBarRating = document.createElement ("span");
			starBarRating.className = "star";
			starBarRating.setAttribute ("disabled", "true");
			starBar.appendChild (starBarRating);
		}

		element.appendChild (starBar);

		var stars = element.querySelectorAll (".star");

		for (var index = 0; index < stars.length; ++index)
		{
			if (stars[index].nodeName == "SPAN")
			{
				DrawStarRating (stars[VibeJs.highlightedElement.getAttribute ("data-rating")]);

				stars[index].addEventListener ("mouseover", function (event)
				{
					DrawStarRating (event.target);
				});
			}
		}

		function DrawStarRating (target)
		{
			var starBarElement = element.querySelectorAll (".star");

			for (var index = 0; index < starBarElement.length; ++index)
			{
				if (starBarElement[index] == target)
				{
					for (var nodeIndex = 0; nodeIndex <= index; ++nodeIndex)
					{
						starBarElement[nodeIndex].style.backgroundImage = 'url("vibe.js/star.png")';
						starBarElement[nodeIndex].removeAttribute ("disabled");
					}

					if (VibeJs.highlightedElement.dataset.rating)
					{
						VibeJs.CommentButton (VibeJs.highlightedElement);
					}

					target.addEventListener ("click", function (event)
					{
						VibeJs.CommentButton ("open");

						for (var index = 0; index < stars.length; ++index)
						{
							if (stars[index] == target){VibeJs.highlightedElement.dataset.rating = index};
						}
					});
				}
				else
				{
					starBarElement[index].style.backgroundImage = 'url("vibe.js/disabledstar.png")';
					starBarElement[index].setAttribute ("disabled", "true");
				}
			}
		}
	},

	CommentButton    : function (state)
	{
		var commentButtonsOnPage = document.querySelectorAll (".commentButton");

		for (var commentButtons in commentButtonsOnPage)
		{
			if (commentButtonsOnPage[commentButtons].parentElement)
			{
				commentButtonsOnPage[commentButtons].parentElement.removeChild (commentButtonsOnPage[commentButtons]);
			}
		}

		var commentButton = document.createElement ("div");
		commentButton.className = "commentButton";
		commentButton.style.left = VibeJs.highlightedElement.offsetWidth - 65 + "px";
		commentButton.style.top = VibeJs.highlightedElement.offsetHeight - 65 + "px";

		VibeJs.commentButton = commentButton;
		VibeJs.highlightedElement.appendChild (commentButton);

		if (state == "open")
		{
			VibeJs.CommentText();
		}
		else
		{
			commentButton.addEventListener ("click", function (event)
			{
				VibeJs.CommentText();
			});
		}
	},

	CommentText      : function()
	{
		if (!VibeJs.commentText)
		{
			var commentText = document.createElement ("div");
			commentText.className = "commentText";
			commentText.style.width = VibeJs.highlightedElement.offsetWidth - 20 + "px";
			commentText.style.height = VibeJs.highlightedElement.offsetHeight - 70 + "px";
			commentText.style.left = "5px";
			commentText.style.top = "40px";
			commentText.style.padding = "10px";
			commentText.style.overflow = "auto";
			commentText.style.color = "#bbbbbb";
			commentText.style.outline = "0px solid transparent";

			if (!VibeJs.highlightedElement.dataset.comment)
			{
				commentText.style.color = "#bbbbbb";
			}
			else
			{
				commentText.style.color = "#000000";
			}

			commentText.setAttribute ("contenteditable", "true");
			commentText.innerText = VibeJs.highlightedElement.dataset.comment || "Add comment here.";

			VibeJs.highlightedElement.appendChild (commentText);
			VibeJs.commentText = commentText;

			commentText.addEventListener ("click", function()
			{
				if (!VibeJs.highlightedElement.dataset.comment)
				{
					commentText.style.color = "#000000";
					VibeJs.commentText.innerText = "";
				}
			});

			commentText.addEventListener ("mouseout", function()
			{
				VibeJs.highlightedElement.dataset.comment = commentText.innerText;
			});
		}
	},

	HighlightElement : function (element)
	{
		var highlightElement = false;

		if (element && element.nodeName && element != VibeJs.ratingForm && element != VibeJs.commentButton && element != VibeJs.widget)
		{
			while (element && !highlightElement)
			{
				var elementNodeName = element.nodeName;

				for (index in VibeJs.targetElements)
				{
					if (elementNodeName == VibeJs.targetElements[index])
					{
						highlightElement = true;
					}
				}

				if (!highlightElement){element = element.parentElement;}
			}

			if (element && !VibeJs.highlightedElement)
			{
				VibeJs.highlightedElement = element;

				var originalOutlineColor = VibeJs.highlightedElement.style.outlineColor || null;
				var originalOutlineStyle = VibeJs.highlightedElement.style.outlineStyle || null;
				var originalBoxShadow = VibeJs.highlightedElement.style.boxShadow || null;
				var originalPosition = VibeJs.highlightedElement.style.position || null;

				VibeJs.highlightedElement.style.outlineColor = "#00A1FF";
				VibeJs.highlightedElement.style.outlineStyle = "dashed";
				VibeJs.highlightedElement.style.boxShadow = "0px 0px 15px #00A1FF";

				if (originalPosition != "absolute" && originalPosition != "fixed"){VibeJs.highlightedElement.style.position = "relative";}

				VibeJs.DrawRatingForm (VibeJs.highlightedElement);

				VibeJs.highlightedElement.addEventListener ("mouseenter", function (event)
				{
					if (VibeJs.highlightedElement)
					{
						VibeJs.DrawRatingForm (VibeJs.highlightedElement);
					}
				});

				VibeJs.highlightedElement.addEventListener ("mouseleave", function (event)
				{
					if (VibeJs.highlightedElement)
					{
						VibeJs.highlightedElement.style.outlineColor = originalOutlineColor;
						VibeJs.highlightedElement.style.outlineStyle = originalOutlineStyle;
						VibeJs.highlightedElement.style.boxShadow = originalBoxShadow;
						VibeJs.highlightedElement.style.position = originalPosition;
					}

					if (VibeJs.ratingForm && VibeJs.ratingForm.parentElement)
					{
						VibeJs.ratingForm.parentElement.removeChild (VibeJs.ratingForm);
						VibeJs.ratingForm = null;
					}

					if (VibeJs.commentButton && VibeJs.commentButton.parentElement)
					{
						VibeJs.commentButton.parentElement.removeChild (VibeJs.commentButton);
						VibeJs.commentButton = null;
					}

					if (VibeJs.commentText && VibeJs.commentText.parentElement)
					{
						VibeJs.commentText.parentElement.removeChild (VibeJs.commentText);
						VibeJs.commentText = null;
					}

					VibeJs.highlightedElement = null;
				})
			}
		}
	},

	Utilities        :
	{
		PreloadImages : function (imagesArray)
		{
			var images = [];

			for (image in imagesArray)
			{
				images[image] = new Image();
				images[image].src = imagesArray[image];
			}
		},

		GetXPath         : function (element)
		{
			if (element.tagName == 'HTML'){return '/HTML[1]'};
			if (element === document.body){return '/HTML[1]/BODY[1]'};

			var index = 0;
			var siblings = element.parentNode.childNodes;

			for (var siblingIndex = 0; siblingIndex < siblings.length; siblingIndex++)
			{
				var sibling = siblings[siblingIndex];

				if (sibling === element)
				{
					return VibeJs.Utilities.GetXPath (element.parentNode) + '/' + element.tagName + '[' + (index + 1) + ']';
				}

				if (sibling.nodeType === 1 && sibling.tagName === element.tagName){index++};
			}
		}
	},

	Dashboard            :
	{
		workspaceView    : false,
		workspaceOverlay : null,
		queryBar         : null,
		auditContainer   : null,
		dataContainer    : null,

		DrawDashboardLauncher : function()
		{
			var dashboardLauncherTimeOut;

			if (VibeJs.dashboardLauncher)
			{
				VibeJs.dashboardLauncher.parentElement.removeChild (VibeJs.dashboardLauncher);
				VibeJs.dashboardLauncher = null;
			}

			var launcher = document.createElement ("div");
			launcher.className = "launcher";

			var launcherIcon = document.createElement ("img");
			launcherIcon.className = "launcherIcon";
			launcherIcon.style.width = "50px";
			launcherIcon.style.height = "50px";
			launcherIcon.style.margin = "4px 0px 0px 130px";
			launcherIcon.style.opacity = "0.4";
			launcherIcon.src = "vibe.js/dashboard.png";

			launcher.addEventListener ("click", function()
			{
				var highlightedElements = document.querySelectorAll (".highlight");

				for (index = 0; index < highlightedElements.length; ++index)
				{
					highlightedElements[index].classList.remove ("highlight");
				}

				if (VibeJs.Dashboard.workspaceView)
				{
					if (VibeJs.Dashboard.workspaceState != "preview")
					{
						VibeJs.Dashboard.workspaceView = false;
						launcherIcon.src = "vibe.js/dashboard.png";
						VibeJs.Dashboard.workspaceOverlay.style.display = "none";
						document.body.style.overflow = "auto";
					}
					else
					{
						VibeJs.Dashboard.workspaceOverlay.style.display = "block";
						launcherIcon.src = "vibe.js/page.png";
						VibeJs.Dashboard.workspaceState = "";
					}
				}
				else
				{
					VibeJs.Dashboard.workspaceView = true;
					launcherIcon.src = "vibe.js/page.png";
					VibeJs.Dashboard.DrawDashboardWorkspace();
					document.body.style.overflow = "hidden";
					VibeJs.Dashboard.workspaceOverlay.style.overflowY = "scroll";
				}
			});

			launcher.appendChild (launcherIcon);

			VibeJs.widgetContainer.appendChild (launcher);
			VibeJs.dashboardLauncher = launcher;

			/*VibeJs.widgetContainer.addEventListener ("mouseout", function (event)
			{
				if (!VibeJs.Dashboard.workspaceOverlay)
				{
					setTimeout (function()
					{
						if (VibeJs.dashboardLauncher)
						{
							VibeJs.dashboardLauncher.parentElement.removeChild (VibeJs.dashboardLauncher);
							VibeJs.dashboardLauncher = null;
						}

						VibeJs.testingButtonState = "ready";
						VibeJs.widget.style.backgroundImage = 'url("vibe.js/talk.png")';

					}, 1000);
				}
			});*/
		},

		DrawDashboardWorkspace : function()
		{
			var workspaceOverlay;

			if (!VibeJs.Dashboard.workspaceOverlay)
			{
				workspaceOverlay = document.createElement ("div");
				workspaceOverlay.className = "workspaceOverlay";
				VibeJs.widgetContainer.appendChild (workspaceOverlay);

				VibeJs.Dashboard.workspaceOverlay = workspaceOverlay;

				var queryBarContainer = document.createElement ("div");
				queryBarContainer.className = "queryBarContainer";
				workspaceOverlay.appendChild (queryBarContainer);

				var auditCardContainer = document.createElement ("div");
				auditCardContainer.className = "auditCardContainer";
				workspaceOverlay.appendChild (auditCardContainer);

				var dataCardContainer = document.createElement ("div");
				dataCardContainer.className = "dataCardContainer";
				workspaceOverlay.appendChild (dataCardContainer);

				VibeJs.Dashboard.dataContainer = dataCardContainer;

				VibeJs.Dashboard.DrawQueryBar (queryBarContainer, function (results)
				{
					var dataCard = VibeJs.Dashboard.DrawDataCards (results);
				});

				VibeJs.Dashboard.DrawAuditCard (auditCardContainer);

			}
			else
			{
				VibeJs.Dashboard.workspaceOverlay.style.display = "block";
			}


		},

		DrawQueryBar : function (parentElement, QueryCallBack)
		{
			if (!VibeJs.Dashboard.queryBar)
			{
				var queryBar = document.createElement ("div");
				queryBar.className = "queryBar";
				queryBar.setAttribute ("contenteditable", "true");
				queryBar.innerText = "rating is not empty and comment is not empty";

				queryBar.addEventListener ("keypress", function (event)
				{
					if (event.keyCode == 13)
					{
						event.preventDefault();

						results = ExecuteQuery (queryBar.innerText);
						QueryCallBack (results);
					}
				});

				parentElement.appendChild (queryBar);
				VibeJs.Dashboard.queryBar = queryBar;

				function ExecuteQuery (query)
				{
					var queryResult = VibeJs.Persist.Retrieve.QueryParser (query);
					return queryResult;
				}
			}

			return null;
		},

		DrawAuditCard : function (cardContainer)
		{
			var auditCard = document.createElement ("div");
			auditCard.className = "auditCard";
			cardContainer.appendChild (auditCard);

			var auditDetails = VibeJs.Persist.Retrieve.AuditDetails();

			console.log (auditDetails)
		},

		DrawDataCards : function (cards)
		{
			while (VibeJs.Dashboard.dataContainer.firstChild)
			{
				VibeJs.Dashboard.dataContainer.removeChild (VibeJs.Dashboard.dataContainer.firstChild);
			}

			for (card in cards)
			{
				var dataCard = document.createElement ("div");
				dataCard.className = "dataCard";

				var starText = "";

				for (count = 0; count < cards[card].rating; count++)
				{
					starText += "&bigstar;";
				}

				var cardRating = document.createElement ("div");
				cardRating.innerHTML = starText;

				var cardComment = document.createElement ("div");
				cardComment.innerText = cards[card].comment;

				var previewElement = document.createElement ("div");
				previewElement.style.backgroundImage = 'url("vibe.js/open.png")';
				previewElement.style.backgroundColor = '#00b6ff';
				previewElement.style.width = "30px";
				previewElement.style.height = "30px";
				previewElement.style.float = "right";
				previewElement.style.cursor = "pointer";
				previewElement.style.backgroundRepeat = "no-repeat";
				previewElement.style.backgroundPosition = "center";
				previewElement.style.borderRadius = "5px";
				previewElement.dataset.xpath = cards[card].xpath;

				dataCard.appendChild (cardRating);
				dataCard.appendChild (cardComment);
				dataCard.appendChild (previewElement);

				VibeJs.Dashboard.dataContainer.appendChild (dataCard);

				previewElement.addEventListener ("click", function()
				{
					var backIcon = document.createElement ("img");
					backIcon.className = "backIcon";
					backIcon.style.width = "50px";
					backIcon.style.height = "50px";
					backIcon.style.margin = "4px 0px 0px 130px";
					backIcon.style.opacity = "0.4";
					backIcon.src = "vibe.js/back.png";

					var cardElement = document.evaluate (event.target.dataset.xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
					cardElement.scrollIntoView ({block: "end", behavior: "smooth"});
					cardElement.classList.add ("highlight");

					VibeJs.Dashboard.workspaceOverlay.style.display = "none";
					VibeJs.Dashboard.workspaceState = "preview";
					VibeJs.Dashboard.DrawDashboardLauncher();

					document.querySelectorAll (".launcherIcon")[0].src = "vibe.js/back.png";
				});
			}
		}
	},

	Persist          :
	{
		currentRecording : {},

		CreateRecording  : function()
		{
			var elements = document.querySelectorAll ("*");

			var newRecording = [];

			for (index in elements)
			{
				if (elements[index].dataset && elements[index].dataset.rating)
				{
					newRecording.push (
					{
						xpath   : VibeJs.Utilities.GetXPath (elements[index]),
						rating  : parseInt (elements[index].dataset.rating) + 1, // Cos we storing a value and not an index.
						comment : elements[index].dataset.comment
					})
				}
			}

			return {
				audit :
				{
					browser   : navigator.userAgent,
					timestamp : Math.round (+new Date() / 1000) // UNIX time.
				},

				data  : newRecording
			}
		},

		Retrieve :
		{
			AuditDetails : function()
			{
				var dataKeys = Object.keys (VibeJs.Persist.currentRecording);

				var auditKeys = dataKeys.filter (function (key)
				{
					return key.indexOf ("audit") !== -1;
				});

				var auditValues = auditKeys.map (function (key)
				{
					return VibeJs.Persist.currentRecording[key];
				});

				return auditValues[0];
			},

			QueryParser : function (query)
			{
				if (VibeJs.Persist.currentRecording.data)
				{
					var parsedQuery = query;

					if (parsedQuery.indexOf ("comment has") != -1)
					{
						var searchTerm = parsedQuery.split ("'")[1];

						return VibeJs.Persist.currentRecording.data.filter (function (key)
						{
							try
							{
								return eval ("key.comment.indexOf ('" + searchTerm + "') != -1") || null;
							}
							catch (error)
							{
								return error;
							}
						});
					}
					else
					{
						for (validKeys in VibeJs.Persist.currentRecording.data[0])
						{
							parsedQuery = parsedQuery.replace (new RegExp (validKeys, 'g'), "key['" + validKeys + "']");
						}

						parsedQuery = parsedQuery.replace (new RegExp ("and", 'g'), "&&");
						parsedQuery = parsedQuery.replace (new RegExp ("or", 'g'), "||");
						parsedQuery = parsedQuery.replace (new RegExp ("is not ", 'g'), "!=");
						parsedQuery = parsedQuery.replace (new RegExp ("is greater than", 'g'), ">");
						parsedQuery = parsedQuery.replace (new RegExp ("is less than", 'g'), "<");
						parsedQuery = parsedQuery.replace (new RegExp ("is", 'g'), "==");
						parsedQuery = parsedQuery.replace (new RegExp ("empty", 'g'), "''");
					}

					return VibeJs.Persist.currentRecording.data.filter (function (key)
					{
						try
						{
							return eval (parsedQuery) || null;
						}
						catch (error)
						{
							return error;
						}
					});
				}
				else
				{
					return null;
				}
			}
		}
	}
}

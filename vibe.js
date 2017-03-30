var VibeJs = {

	testingState       : "paused",
	theme              : null,
	widgetContainer    : null,
	widget             : null,
	highlightedElement : null,
	ratingForm         : null,
	commentButton      : null,
	commentText        : null,
	targetElements     : ["DIV", "SPAN"],

	DrawWidget       : function()
	{
		this.widgetContainer = document.querySelectorAll ("vibejs")[0];
		this.widget = document.createElement ("div");
		this.widget.className = "feedBackWidget " + this.theme;
		this.widgetContainer.appendChild (this.widget);

		this.widget.addEventListener ("click", function (event)
		{
			if (VibeJs.testingState == "paused")
			{
				VibeJs.testingState = "recording";
				VibeJs.widget.style.backgroundImage = 'url("vibe.js/pause.png")';

				document.addEventListener ("mouseover", function (event)
				{
					if (VibeJs.testingState == "recording")
					{
						VibeJs.HighlightElement (event.target);
					}
				});
			}
			else if (VibeJs.testingState == "recording")
			{
				VibeJs.testingState = "paused";
				VibeJs.widget.style.backgroundImage = 'url("vibe.js/talk.png")';
				VibeJs.highlightedElement = null;

				var elements = document.querySelectorAll ("*");

				for (index in elements)
				{
					if (elements[index].dataset && elements[index].dataset.rating)
					{
						console.log (VibeJs.GetXPath (elements[index]));
						console.log (elements[index].dataset.rating);
						console.log (elements[index].dataset.comment);
					}
				}

				console.log (navigator.userAgent);
			}
		})
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
				return VibeJs.GetXPath (element.parentNode) + '/' + element.tagName + '[' + (index + 1) + ']';
			}

			if (sibling.nodeType === 1 && sibling.tagName === element.tagName){index++};
		}
	}
}

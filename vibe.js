var VibeJs = {

	theme              : null,
	widgetContainer    : null,
	widget             : null,
	highlightedElement : null,
	ratingForm         : null,
	targetElements     : ["DIV", "SPAN"],

	DrawWidget       : function()
	{
		this.widgetContainer = document.querySelectorAll ("feedback")[0];
		this.widget = document.createElement ("div");
		this.widget.className = "feedBackWidget " + this.theme;
		this.widgetContainer.appendChild (this.widget);

		this.widget.addEventListener ("click", function (event)
		{
			VibeJs.widget.style.backgroundImage = 'url("vibe.js/pause.png")';

			document.addEventListener ("mouseover", function (event)
			{
				VibeJs.HighlightElement (event.target);
			});

			var elements = document.querySelectorAll ("*");

			for (index in elements)
			{
				console.log (elements[index])

				if (elements[index].dataset && elements[index].dataset.rating)
				{
					console.log (VibeJs.GetXPath (elements[index]));
					console.log (elements[index].dataset.rating);
				}
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

		var starBarRating1 = document.createElement ("span");
		starBarRating1.className = "star";
		starBarRating1.setAttribute ("disabled", "true");

		var starBarRating2 = document.createElement ("span");
		starBarRating2.className = "star";
		starBarRating2.setAttribute ("disabled", "true");

		var starBarRating3 = document.createElement ("span");
		starBarRating3.className = "star";
		starBarRating3.setAttribute ("disabled", "true");

		var starBarRating4 = document.createElement ("span");
		starBarRating4.className = "star";
		starBarRating4.setAttribute ("disabled", "true");

		var starBarRating5 = document.createElement ("span");
		starBarRating5.className = "star";
		starBarRating5.setAttribute ("disabled", "true");

		starBar.appendChild (starBarRating1);
		starBar.appendChild (starBarRating2);
		starBar.appendChild (starBarRating3);
		starBar.appendChild (starBarRating4);
		starBar.appendChild (starBarRating5);

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

					target.addEventListener ("click", function (event)
					{
						for (var index = 0; index < stars.length; ++index)
						{
							if (stars[index] == target){VibeJs.highlightedElement.dataset.rating = index};
						}

						VibeJs.CommentButton (VibeJs.highlightedElement);
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

	CommentButton    : function (element)
	{
		var commentButton = document.createElement ("div");
		commentButton.className = "commentButton";
		commentButton.offsetleft = "100px";
		commentButton.offsetTop = "100px";

		VibeJs.highlightedElement.appendChild (commentButton);
	},

	HighlightElement : function (element)
	{
		var highlightElement = false;

		if (element && element.nodeName && element != VibeJs.ratingForm && element != VibeJs.widget)
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
						VibeJs.highlightedElement = null;
					}
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

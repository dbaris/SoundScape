class ColorMenu
{
	constructor()
	{
		this.canvas = document.getElementById("colorMenu");
		this.colorNames = ["A", "A#/Bb", "B", "C", "C#/Db", "D", 
		                   "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab"];
	}

	display(colors)
	{
		this.canvas.width = document.documentElement.clientWidth * .8;
		
		var ctx = this.canvas.getContext("2d");
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		ctx.beginPath();

		// this will also be width & height of each square
		var spacing = this.canvas.width / (this.colorNames.length * 2 + 1);

		var buttonHtml = "";

		for (var i = 0; i < colors.length; i++)
		{
			var x_pos = spacing + spacing * i + i * spacing;
			// text
			ctx.fillStyle = "black";
			ctx.font = "12px Raleway";
			ctx.fillText(this.colorNames[i], x_pos, 20);

			// rectangle
			ctx.fillStyle = colors[i];
			ctx.fillRect(x_pos, 20, spacing, spacing);
			ctx.stroke();

			buttonHtml += "<button id=\"colorButton_" + i + "\">Click me pls</button>"
			$("#colorButton_" + i).click(function(){
			    alert("working!");
			});


		}

	}

}


		
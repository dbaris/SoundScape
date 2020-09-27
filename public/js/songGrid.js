class SongGrid
{
	constructor(notes)
	{
		this.notes = notes;
		this.canvas = document.getElementById("myCanvas");

	}

	display(colors)
	{
		this.canvas.width = document.documentElement.clientWidth * .5;
		this.display_as_grid(colors);
	}

	get_num_cols(num_notes)
	{
		return Math.sqrt(num_notes / 2);
	}
	
	display_as_grid(colors)
	{
		var ctx = this.canvas.getContext("2d");
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		ctx.beginPath();

		var total_notes = this.notes.length;
		var total_cols = this.get_num_cols(total_notes);
		var total_rows = Math.ceil(total_notes / total_cols);
		var square_w = this.canvas.height / (total_rows);
		var square_h = this.canvas.width / (total_cols);

		if (square_h < square_w)
		{
			square_w = square_h;
		}

		var notes_i = 0;
		for (var row_i = 0; row_i < total_rows; row_i ++)
		{
			for (var col_i = 0; col_i < total_cols; col_i++)
			{
				if (notes_i > total_notes)
				{
					break;
				}
				ctx.fillStyle = colors[this.notes[notes_i]];
				ctx.fillRect(square_w * col_i, 
					         square_w * row_i, 
					         square_w, 
					         square_w);
				ctx.stroke();
				notes_i += 1;
			}
			if (notes_i > total_notes)
			{
				break;
			}
		}
		var margin_left = (window.innerWidth - total_cols * square_w) / 2;
		$("#myCanvas").css('margin-left', margin_left);
		$("canvas").show();
	}

}
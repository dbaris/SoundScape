class SongGrid
{
	constructor(notes)
	{
		this.notes = notes;
		this.canvas = document.getElementById("myCanvas");

	}

	draw_row(row_notes)
	{
		console.log(row_notes);
	}

	display(colors)
	{
		this.canvas.width = document.documentElement.clientWidth * .5;
		this.display_as_grid(colors);
	}

	song_is_long(num_notes)
	{
		return num_notes > 1000
	}

	isPrime(value) {
	    for(var i = 2; i < value; i++) {
	        if(value % i === 0) {
	            return false;
	        }
	    }
	    return value > 1;
	}

	get_num_cols(num_notes)
	{
		// Not a perfect guarantee, but an easy mod to avoid getting to 1 column
		if (this.isPrime(num_notes))
		{
			num_notes -= 1;
		}
		
		var cols = Math.round(Math.sqrt(num_notes));

		while (num_notes % cols != 0)
		{
			cols -= 1;
		}

		return cols;
	}

	get_square_size(num_notes)
	{
		if (this.song_is_long(num_notes))
		{
			return 5;
		}
		return 10;
	}
	
	display_as_grid(colors)
	{
		var ctx = this.canvas.getContext("2d");
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		ctx.beginPath();

		var total_notes = this.notes.length;
		var total_cols = this.get_num_cols(total_notes);
		var total_rows = total_notes / total_cols;
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

	display_as_diamond(colors)
	{

	}
}
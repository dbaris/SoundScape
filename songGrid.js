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

	// rectangle version :)
	display(colors)
	{
		this.display_as_grid(colors);
	}

	song_is_long(num_notes)
	{
		return num_notes > 1000
	}

	get_num_cols(num_notes)
	{
		if (this.song_is_long(num_notes))
		{
			return 70;
		}
		return 47;
	}

	get_square_size(num_notes)
	{
		if (this.song_is_long(num_notes))
		{
			return 2;
		}
		return 4;

	}
	
	display_as_grid(colors)
	{
		var ctx = this.canvas.getContext("2d");
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		ctx.beginPath();

		var total_notes = this.notes.length;
		var total_cols = this.get_num_cols(total_notes)
		var total_rows = total_notes / total_cols;
		var square_w = this.get_square_size(total_notes)

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
				ctx.fillRect(10 + square_w * col_i + col_i * 2, 10 + row_i * square_w + row_i * 2, square_w, square_w);
				ctx.stroke();
				notes_i += 1;
			}
			if (notes_i > total_notes)
			{
				break;
			}
		}

		$("canvas").show();
	}

	// display(colors)
	// {
	// 	var ctx = this.canvas.getContext("2d");
	// 	ctx.beginPath();
		
	// 	var h_center = this.canvas.width / 2;
	// 	var v_center = this.canvas.height / 2;

	// 	var total_notes = this.notes.length;
	// 	console.log(total_notes);
	// 	var current_note = 0;
	// 	console.log(this.notes);
	// 	for (var notes_per_row = 1; notes_per_row <= 6; notes_per_row ++)
	// 	{
	// 		this.draw_row(this.notes.slice(current_note, current_note+notes_per_row));
	// 		current_note += notes_per_row;

	// 	}
	// 	// ctx.fillRect(h_center, 5, 150, 100);
	// 	// ctx.stroke();
	// 	// ct


	// 	$("canvas").show();
	// }
}
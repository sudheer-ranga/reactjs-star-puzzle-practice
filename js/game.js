var StarFrame = React.createClass({

	render: function() {
		// debugger;
		var noOfStars = this.props.noOfStars;
		var stars = [];

		for (var i = 0; i < noOfStars; i++) {
			stars.push(
				<span key={i} className="glyphicon glyphicon-star"></span>
			);
		};

		return (
			<div className="col-sm-5 well game-blocks">
				{stars}
			</div>
		)
	}
});

var ButtonFrame = React.createClass({
	render: function() {
		var disabled,
				button,
				correct = this.props.correct;

		switch(correct) {
			case true:
				button = (
					<button className="btn btn-success btn-large validate-btn"
									onClick={this.props.acceptAnswer}>
						<span className="glyphicon glyphicon-ok"></span>
					</button>
				)
				break;
			
			case false:
				button = (
					<button className="btn btn-danger btn-large validate-btn">
						<span className="glyphicon glyphicon-remove"></span>
					</button>
				)
				break;

			default:
				disabled = (this.props.selectedNumbers.length === 0);
				button = (
					<button className="btn btn-primary btn-large validate-btn"
								disabled={disabled}
								onClick={this.props.checkAnswer}>
								=
					</button>
				)
		}

		return (
			<div className="col-sm-2 game-blocks">
			{button}
			<button className="btn btn-warning btn-xs"
							onClick={this.props.redraw}
							disabled={this.props.redrawLimit === 0}>
				<span className="glyphicon glyphicon-refresh"></span>
				{this.props.redrawLimit}
			</button>
			</div>
		)
	}
});

var AnswerFrame = React.createClass({
	render: function() {
		var selectedNumbersArray = this.props.selectedNumbers,
				deselectNumber = this.props.deselectNumber;

		var selectedNumbers = selectedNumbersArray.map(function(num) {
			return <span className="number" key={num} onClick={deselectNumber.bind(null, num)}>{num}</span>
		});

		return (
			<div className="col-sm-5 well game-blocks">
				{selectedNumbers}
			</div>
		)
	}
});

var NumbersFrame = React.createClass({

	render: function() {
		var numbers = [],
				classNames,
				selectedNumbers = this.props.selectedNumbers,
				selectNumber = this.props.selectNumber,
				usedNumbers = this.props.usedNumbers;

		for (var i = 1; i <= 9; i++) {
			classNames = "number selected-" + ( selectedNumbers.indexOf(i) >=0 );
			classNames += " used-" + ( usedNumbers.indexOf(i) >=0 );
			numbers.push(
				<span className={classNames} key={i} onClick={selectNumber.bind(null, i)}>{i}</span>
			);
		};

		return (
			<div className="col-sm-6 col-sm-push-3 well">
				{numbers}
			</div>
		)
	}
});

var DoneFrame = React.createClass({
	render: function() {
		return (
			<div className="col-sm-6 col-sm-push-3 well">
				<h2>{this.props.doneStatus}</h2>
			</div>
		)	
	}
});

var Game = React.createClass({
	getInitialState: function() {
		return {
			noOfStars: this.randomNumber(),
			selectedNumbers: [],
			usedNumbers: [],
			correct: null,
			redrawLimit: 5,
			doneStatus: null,
		}
	},

	randomNumber: function() {
		return Math.floor( (Math.random()*9) )+1;
	},

	selectNumber: function(clickedNumber) {
		var selectedNumbers = this.state.selectedNumbers,
				usedNumbers = this.state.usedNumbers;

		if(selectedNumbers.indexOf(clickedNumber) < 0 && usedNumbers.indexOf(clickedNumber) < 0) {
			this.setState({
				selectedNumbers: this.state.selectedNumbers.concat(clickedNumber),
				correct: null
			});
		}
	},

	deselectNumber: function(clickedNumber) {
		var selectedNumbers = this.state.selectedNumbers,
				indexOfNumber = selectedNumbers.indexOf(clickedNumber);

		selectedNumbers.splice(indexOfNumber, 1);
		this.setState({
			selectedNumbers: selectedNumbers,
			correct: null
		});
	},

	sumOfSelectedNumbers: function() {
		return this.state.selectedNumbers.reduce(function(n1, n2) {
			return n1 + n2;
		}, 0);
	},

	checkAnswer: function() {
		var correct = (this.state.noOfStars == this.sumOfSelectedNumbers());
		this.setState({correct: correct});
	},

	acceptAnswer: function() {
		var usedNumbers = this.state.usedNumbers.concat(this.state.selectedNumbers);

		this.setState({
			correct: null,
			noOfStars: this.randomNumber(),
			selectedNumbers: [],
			usedNumbers: usedNumbers,
		}, function() {
			this.updateDoneStatus();
		});
	},

	redraw: function() {
		if(this.state.redrawLimit > 0) {
			this.setState({
				correct: null,
				noOfStars: this.randomNumber(),
				selectedNumbers: [],
				redrawLimit: this.state.redrawLimit - 1,
			}, function() {
				this.updateDoneStatus();
			});
		}
	},

	noPossibleSolutions: function() {
	},

	updateDoneStatus: function() {
		if(this.state.usedNumbers === 9) {
			this.setState({
				doneStatus: "You Won!"
			});
		}

		if(this.state.redrawLimit === 0 && !this.noPossibleSolutions() ) {
			this.setState({
				doneStatus: "Game Over!!!"
			});
		}
	},

	render: function() {
		var selectedNumbers = this.state.selectedNumbers,
				noOfStars = this.state.noOfStars,
				correct = this.state.correct,
				redrawLimit = this.state.redrawLimit,
				doneStatus = this.state.doneStatus;

		var BottomFrame;

		if(this.state.doneStatus) {
			BottomFrame = <DoneFrame doneStatus={doneStatus} />
		} else {
			BottomFrame = <NumbersFrame selectedNumbers={selectedNumbers}
											selectNumber={this.selectNumber}
											usedNumbers={this.state.usedNumbers} />
		}

		return (
			<div id="game">
				<h2>Play Nine!</h2>
				<hr />
				<StarFrame noOfStars={noOfStars} />
				<ButtonFrame selectedNumbers={selectedNumbers}
											correct={correct}
											checkAnswer={this.checkAnswer}
											acceptAnswer={this.acceptAnswer}
											redraw={this.redraw}
											redrawLimit={redrawLimit} />
				<AnswerFrame selectedNumbers={selectedNumbers}
											deselectNumber={this.deselectNumber} />
				{BottomFrame}
			</div>
		)
	}
});

ReactDOM.render(<Game />, document.querySelector("#app"));
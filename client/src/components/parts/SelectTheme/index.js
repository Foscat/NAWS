import React from 'react';
import { Button } from "reactstrap"
import { standard, dark, colorBlind } from "utils/styles"

// click is a function that is propped in that changes user theme in the DB
const SelectTheme = ({click}) => {
	return(
		<div>
			<Button 
				style={{...styles.standard, ...styles.def}} 
				onClick={()=>{localStorage.setItem("colorTheme", "0"); click(0);}}
			>
				Standard
			</Button>
			<Button 
				style={{...styles.dark, ...styles.def}} 
				onClick={()=>{localStorage.setItem("colorTheme", "1"); click(1);}}
			>
				Dark
			</Button>
			<Button 
				style={{...styles.colorBlind, ...styles.def}} 
				onClick={()=>{localStorage.setItem("colorTheme", "2"); click(2);}}
			>
				Color Blind
			</Button>
		</div>
	);
};

const styles = {
	def: {
		fontWeight: 600,
		margin: "5px",
	},
	standard: standard.classes.confirmBtn,
	dark: dark.classes.confirmBtn, 
	colorBlind: colorBlind.classes.confirmBtn
}

export default SelectTheme;
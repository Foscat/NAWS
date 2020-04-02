// Default colors and fonts
const standard = {
    colors:{
        background:"#1b262c",
        main: "#0f4c75",
        secondary: "#3282b8",
        accent: "#bbe1fa",
        accent2: "#790000"
    },
    fonts: {
        title: "",
        sub: "",
        text: ""
    },
    classes: {
        page: { 
            justifyContent: "center",
            backgroundColor: "#1b262c",
            color: "#3282b8",
        },
        sweetBox:{ 
            maxHeight: "50vh", 
            minWidth: "50%", 
            overflow: "auto" 
        },
        confirmBtn: {
            backgroundColor: "#0f4c75", 
            color: "#bbe1fa", 
            fontWeight: 600, 
            borderColor: "#bbe1fa"
        },
        closeBtn: {
            backgroundColor: "#790000", 
            color: "#bbe1fa", 
            fontWeight: 600, 
            borderColor: "#0f4c75"
        },
    }

};
//  Colors and fonts for dark mode
const dark = {
    colors:{
        background:"#2C2B30",
        main: "#4F4F51",
        secondary: "#F58F7C",
        accent: "#D6D6D6",
        accent2: "#671110"
    },
    fonts: {
        title: "",
        sub: "",
        text: ""
    },
    classes: {
        page: { 
            justifyContent: "center",
            backgroundColor: "#2C2B30",
            color: "#F58F7C",
        },
        sweetBox:{ 
            maxHeight: "50vh", 
            minWidth: "50%", 
            overflow: "auto" 
        },
        confirmBtn: {
            backgroundColor: "#4F4F51", 
            color: "#D6D6D6", 
            fontWeight: 600, 
            borderColor: "#D6D6D6"
        },
        closeBtn: {
            backgroundColor: "#671110", 
            color: "#D6D6D6", 
            fontWeight: 600, 
            borderColor: "#4F4F51"
        },
    }
};
// Colors and fonts for color-blind people
const colorBlind = {
    colors:{
        background: "#34343d",
        main: "#2c2ca0",
        secondary: "#e7e7bd",
        accent:"#efef32",
        accent2: "#34343d"
    },
    fonts: {
        title: "",
        sub: "",
        text: ""
    },
    classes: {
        page: { 
            justifyContent: "center",
            backgroundColor:  "#34343d",
            color: "#e7e7bd"
        },
        sweetBox:{ 
            maxHeight: "50vh", 
            minWidth: "50%", 
            overflow: "auto" 
        },
        confirmBtn: {
            backgroundColor: "#2c2ca0", 
            color: "#efef32", 
            fontWeight: 600, 
            borderColor: "#efef32"
        },
        closeBtn: {
            backgroundColor: "#34343d", 
            color: "#efef32", 
            fontWeight: 600, 
            borderColor: "#2c2ca0"
        },
    }
};

module.exports = { standard, dark, colorBlind };
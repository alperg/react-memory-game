import React from "react";

function Image({ src, alt="", style={}, className="", ...props }) {
	return <img data-hahaha="hahahaha" src={src} alt={alt} style={style} className={className} {...props}/>;
}

export default function Card({imageURL, isFlipped, onClick}) {
	return <div className="card-container" onClick={onClick}>
		<div className={"card" + (isFlipped ? " flipped" : "")}>
			<Image className="side front" src={imageURL}/>
			<div className="side back"/>
		</div>
	</div>;
}

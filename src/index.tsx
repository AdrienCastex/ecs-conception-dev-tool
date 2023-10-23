import React from "react";
import ReactDOMClient from 'react-dom/client';
import { AppView } from "./app/view/App/AppView";
import { Config, IConfigOptions } from "./app/Config";
import { ECS_Data } from "./app/model/ECS_Data";

(window as any).start = (config: IConfigOptions) => {
	Config.instance = new Config(config);

	window.onbeforeunload = function() {
		return "Are you sure to close this tool?";
	};

	ECS_Data.current = new ECS_Data();

	const view = document.querySelector('.view');
	const root = ReactDOMClient.createRoot(view);
	root.render(<AppView />);
};

import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.jsx";
import "@/styles/global.css";
import { ApolloProvider } from "@apollo/client";
import client from "@/utils/apolloClient";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<App />
		</ApolloProvider>
	</React.StrictMode>
);

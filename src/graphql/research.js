import { gql } from "@apollo/client";

export const START_RUN = gql`
	mutation StartRun($researchId: Int!, $identifier: String!) {
		startRun(researchId: $researchId, identifier: $identifier) {
			id
			isCompleted
			messages
			researchId
			updated
			uuid
			identifier
			created
		}
	}
`;

export const CONTINUE_RUN = gql`
	mutation ContinueRun($uuid: ID!, $content: String!) {
		continueRun(uuid: $uuid, content: $content) {
			id
			isCompleted
			messages
			researchId
			updated
			uuid
			identifier
			created
		}
	}
`;

export const RESEARCH = gql`
	query Research($uuid: ID!) {
		research(uuid: $uuid) {
			assignedTo
			created
			creatorId
			files
			id
			end
			description
			instruction
			status
			title
			updated
			uuid
		}
	}
`;

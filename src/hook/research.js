import { CONTINUE_RUN, RESEARCH, START_RUN } from "@/graphql/research";
import { useGeneralStore } from "@/store/general";
import { useMutation, useQuery } from "@apollo/client";
import { useDebouncedCallback } from "use-debounce";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useParams } from "react-router-dom";

export const useStartResearch = (mutateOptions = {}) => {
	const { setVisitorId } = useGeneralStore();
	const [mutate, { loading, data }] = useMutation(START_RUN, mutateOptions);

	const doRequest = useDebouncedCallback(async () => {
		const fp = await FingerprintJS.load();
		const { visitorId } = await fp.get();
		setVisitorId(visitorId);
		mutate({
			variables: {
				researchId: 1,
				identifier: visitorId,
			},
		});
	}, 250);

	return { doRequest, loading, data };
};

export const useContinueResearch = () => {
	return useMutation(CONTINUE_RUN);
};

export const useResearch = () => {
	const { id } = useParams();
	return useQuery(RESEARCH, {
		variables: { uuid: id },
		skip: !id,
	});
};

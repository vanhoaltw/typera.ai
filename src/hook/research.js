import { CONTINUE_RUN, RESEARCH, START_RUN } from "@/graphql/research";
import { useMutation, useQuery } from "@apollo/client";
import { useDebouncedCallback } from "use-debounce";
import { useParams } from "react-router-dom";
import { getUniqueID } from "@/utils/fingerprint";
import { useGeneralStore } from "@/store/general";

export const useStartResearch = (mutateOptions = {}) => {
	const [mutate, { loading, data }] = useMutation(START_RUN, mutateOptions);
	const { research } = useGeneralStore();

	const doRequest = useDebouncedCallback(async (options) => {
		if (!research?.id) return;
		const visitorId = getUniqueID();
		await mutate({
			variables: {
				researchId: research.id,
				identifier: visitorId,
			},
			...options,
		});
	}, 250);

	return { doRequest, loading, data };
};

export const useContinueResearch = () => {
	return useMutation(CONTINUE_RUN);
};

export const useResearch = () => {
	const { id } = useParams();
	const { setResearch } = useGeneralStore();

	return useQuery(RESEARCH, {
		variables: { uuid: id },
		skip: !id,
		onCompleted: (data) => {
			setResearch(data?.research);
		},
	});
};

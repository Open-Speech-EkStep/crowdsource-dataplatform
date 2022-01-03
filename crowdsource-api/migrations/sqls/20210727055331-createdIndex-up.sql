CREATE INDEX dataset_row_media_language_index ON dataset_row USING HASH ((media->>'language'));

CREATE INDEX contributions_media_language_index ON contributions USING HASH ((media->>'language'));

CREATE INDEX dataset_row_type_index
    ON public.dataset_row USING btree
    (type ASC NULLS LAST);

CREATE INDEX dataset_row_state_index
    ON public.dataset_row USING btree
    (state ASC NULLS LAST);

CREATE INDEX contributions_action_index
    ON public.contributions USING btree
    (action ASC NULLS LAST);

CREATE INDEX validations_action_index
    ON public.validations USING btree
    (action ASC NULLS LAST);
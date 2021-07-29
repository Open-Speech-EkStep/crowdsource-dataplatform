ALTER TABLE public.contributions
    ADD CONSTRAINT "FK_dataset_row" FOREIGN KEY (dataset_row_id)
    REFERENCES public.dataset_row (dataset_row_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

CREATE INDEX contributions_dataset_row_id_index
    ON public.contributions USING btree
    (dataset_row_id ASC NULLS LAST);

 CREATE INDEX validations_contribution_id_index
    ON public.validations USING btree
    (contribution_id ASC NULLS LAST);

CREATE INDEX contributions_contributor_id_index
    ON public.contributions USING btree
    (contributed_by ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS cds_type_index
    ON public.contributions_and_demo_stats USING btree
    (type ASC NULLS LAST);
	
CREATE INDEX IF NOT EXISTS cds_language_index
    ON public.contributions_and_demo_stats USING btree
    (language ASC NULLS LAST);
	
CREATE INDEX IF NOT EXISTS cds_issystem_index
    ON public.contributions_and_demo_stats USING btree
    (is_system ASC NULLS LAST);
	
CREATE INDEX IF NOT EXISTS dashboard_type_index
    ON public.dashboard_stats USING btree
    (type ASC NULLS LAST);
	
CREATE INDEX IF NOT EXISTS dashboard_language_index
    ON public.dashboard_stats USING btree
    (language ASC NULLS LAST);
	
CREATE INDEX IF NOT EXISTS dashboard_issystem_index
    ON public.dashboard_stats USING btree
    (is_system ASC NULLS LAST);
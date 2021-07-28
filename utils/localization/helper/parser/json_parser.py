import re


class TagParser:

    def __init__(self, allowed_replacements: list):
        self.allowed_replacements = allowed_replacements  # ["u", "v", "w", "x", "y", "z"]
        self.a_tag_replacement = 'a-tag-replacement'
        self.replacement_mapping_dict = {}
        self.replacement_identifier_index = 0

    def __parse_tags(self, text):
        self.replacement_mapping_dict = {}
        self.replacement_identifier_index = 0
        tag_identification_regex = r"<(\S*?)[^>]*>.*?<\/\1>|<.*?\/>"
        out_txt = text
        matched_tags = re.finditer(tag_identification_regex, out_txt, re.MULTILINE)
        for match in matched_tags:
            matched_tag = match.group()
            if "<b>" in matched_tag:
                continue
            elif "<a" in matched_tag:
                out_txt = self.__parse_a_tag(matched_tag, out_txt)
            else:
                out_txt = self.__parse_tag(matched_tag, out_txt)
        return out_txt

    def __parse_tag(self, matched_tag, out_txt):
        replacement = self.allowed_replacements[self.replacement_identifier_index]
        self.replacement_mapping_dict[replacement] = matched_tag
        self.replacement_identifier_index += 1
        out_txt = out_txt.replace(matched_tag, '<{}>'.format(replacement))
        return out_txt

    def __parse_a_tag(self, matched_tag, out_txt):
        attributes_part_string = matched_tag[matched_tag.find('<a') + 2: matched_tag.find('>')]
        self.replacement_mapping_dict[self.a_tag_replacement] = attributes_part_string
        matched_tag_replacement = matched_tag.replace(attributes_part_string, "")
        out_txt = out_txt.replace(matched_tag, matched_tag_replacement)
        return out_txt

    def __get_dict_for_data(self, key, processed_text):
        out_dict = {"Key": key, "English copy": processed_text}
        for replacement in sorted(self.replacement_mapping_dict.keys()):
            out_dict[replacement] = self.replacement_mapping_dict[replacement]
        return out_dict

    def parse(self, data):
        parsed_data = []
        for key, value in data.items():
            processed_text = self.__parse_tags(value)
            data_dict = self.__get_dict_for_data(key, processed_text)
            parsed_data.append(data_dict)
        return parsed_data

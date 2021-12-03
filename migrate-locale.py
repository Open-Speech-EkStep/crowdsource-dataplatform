import json
from pathlib import Path


def read_json(path):
    with open(path, 'r') as fd:
        return json.load(fd)


def get_locale_mappings():
    mapped_data = {}
    unmapped_data = []
    json_data1 = read_json('./crowdsource-fe/public/locales/en/common.json')
    json_data2 = read_json('./crowdsource-ui/locales/en.json')

    for key, value in json_data1.items():
        key_found = False
        for key2, value2 in json_data2.items():
            if value == value2:
                key_found = True
                mapped_data[key] = key2
        if not key_found:
            unmapped_data.append(key)
            mapped_data[key]=''
    return mapped_data, unmapped_data


def main():
    languages = ['hi', 'ta', 'gu', 'te', 'mr', 'ml', 'kn', 'or', 'pa', 'as', 'bn']

    mapped_data, unmapped_data = get_locale_mappings()
    for language in languages:
        language_locale = {}
        current_translations=None
        language_data = read_json('./crowdsource-ui/locales/{}.json'.format(language))
        try:
            current_translations = read_json('./crowdsource-fe/public/locales/{}/common.json'.format(language))
        except: pass

        for key, value in mapped_data.items():
            if current_translations and (key in current_translations) and current_translations[key]!='':
                language_locale[key] = current_translations[key]
                continue
            if value=='':
                language_locale[key]=''
                continue
            language_locale[key] = language_data[value]
        
        Path('./migrated-jsons/{}'.format(language)).mkdir(parents=True, exist_ok=True)

        print('Writing {} translations'.format(language))
        with open('./migrated-jsons/{}/common.json'.format(language), 'w') as f:
            f.write(json.dumps(language_locale, indent=4, ensure_ascii=False))

    print('\nUnmapped translation keys-\n')
    print(unmapped_data)

if __name__ == '__main__':
    main()
import unittest
from LocaleGenerator import gen_locales, read_json

class TestLocaleGeneration(unittest.TestCase):

    def test_success_path(self):
        languages = [('hi','Hindi')]
        base_path = "./../test-data/proper-locale-gen-check"

        input_base_path = base_path+'/inputs'
        input_json_path = base_path
        meta_input_path = base_path+"/out-meta"
        output_base_path = base_path+"/out_json"

        gen_locales(languages, input_base_path,input_json_path, meta_input_path, output_base_path)


        hi_json = read_json(output_base_path+'/hi.json')

        assert len(hi_json) == 16
        assert hi_json['(No Username)'] == 'No'
        assert hi_json['10 - 30 (Youth)'] == '10 - 30 वर्ष (युवा)'
        assert hi_json['<a class="" href="/">Click Here</a> to go back to home page'] == 'अपने होम पेज पर जाने के लिए <a class="" href="/">यहाँ क्लिक</a> करें'
        assert hi_json['By proceeding ahead you agree to the <a href="../terms-and-conditions.html" target="_blank"> Terms and Conditions</a>'] == 'आगे बढ़ने का मतलब है कि आप इन <a href="../terms-and-conditions.html" target="_blank"> नियमों और शर्तों</a> से सहमत हैं'
        assert hi_json['By proceeding ahead you agree to the <a href="./terms-and-conditions.html" target="_blank"> Terms and Conditions</a>'] == 'आगे बढ़ने का मतलब है कि आप इन <a href="./terms-and-conditions.html" target="_blank"> नियमों और शर्तों</a> से सहमत हैं'
        assert hi_json['Contributions'] == 'योगदान'
        assert hi_json['Female'] == 'महिला'
        assert hi_json['Language'] == 'हिंदी'
        assert hi_json['Get started by clicking on <b>Record</b> button'] == "'रिकॉर्ड करें' बटन पर क्लिक करके शुरू करें"
        assert hi_json['TO'] == 'इस भाषा में'
        assert hi_json['Validate More'] == 'और सत्यापन करें'
        assert hi_json['You’ve earned a <span id="current_badge_name_1"></span> Bhasha Samarthak Badge by validating <span id="current_badge_count"></span> Images.'] == 'आपने <span id="current_badge_count"></span> इमेज को सत्यापित करके एक <span id="current_badge_name_1"></span> भाषा समर्थक बैज जीता है।'
        assert hi_json['image label(s) validated'] == 'इमेज लेबल सत्यापित किए गए'
        assert hi_json['Your next goal is to reach <span id="next_badge_count"></span> images to earn your <span id="next_badge_name_1"></span> Bhasha Samarthak Badge.'] == 'अपना <span id="next_badge_name_1"></span> भाषा समर्थक बैज जीतने के लिए आपका अगला लक्ष्य <span id="next_badge_count"></span> इमेज तक पहुंचना है।'

        assert hi_json['social sharing text with rank'] == 'मैंने https://bhashini.gov.in/bhashadaan पर भारत के लिए ओपन लैंग्वेज रिपॉज़िटरी बनाने में योगदान किया है। आप और मैं हमारी आवाज़ों का योगदान करके इस पहल में काफ़ी फ़र्क डाल सकते हैं जिससे मशीन को हमारी भाषा सीखने में मदद मिलती है। \\"बोलो इंडिया\\" पर हमारी <x> भाषा का रैंक <y> है। अपनी भाषा को सशक्त बनाने में अपना योगदान देना चाहेंगे?'


if __name__ == '__main__':
    unittest.main()
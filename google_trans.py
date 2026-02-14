from googletrans import Translator

def translate_text(input_text, input_lang, output_lang):
    translator=Translator()
    translation= translator.translate(input_text, src=input_lang, dest=output_lang)
    return translation.text

if __name__== "__main__":
    input_text=input("Enter text :")
    input_lang="en"
    output_lang= input("Enter you want to translate To:")
    translated_text= translate_text(input_text, input_lang, output_lang)
    print("Orginal text: {}".format(input_text))
    print("Translated text : {}".format(translated_text))
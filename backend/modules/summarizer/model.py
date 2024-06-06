import torch
import re
from transformers import BartTokenizer

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(device)
BB_TOKENIZER = BartTokenizer.from_pretrained('facebook/bart-base')


BB_MODEL = torch.load('bart_base.pth', map_location=device)

BB_MODEL = BB_MODEL.to(device)
BB_MODEL.eval()

def clean_text(text):
    text = text.replace('\n', ' ')
    text = text.strip()
    text = re.sub(r'http\S+|www.\S+', '', text)
    text = re.sub(r'[^\x00-\x7F]+', '', text).replace('\\','')
    text = re.sub(r'\s+', ' ', text)
    text = text.lower()
    return text

def generate_summaries_with_ids(model, tokenizer, input_ids_batch,summary_max_len, num_beams=1):
  output_ids = model.generate(input_ids_batch,use_cache=True, num_beams=num_beams,max_new_tokens=summary_max_len)
  return tokenizer.batch_decode(output_ids, skip_special_tokens=True)

def generate_summary_text(model, tokenizer, input_text, max_length, summary_max_len,num_beams=1):
  input_text = clean_text(input_text)
  input_ids = tokenizer.encode(input_text, max_length=max_length,truncation=True, return_tensors='pt', add_special_tokens=True).to(device)
  print(input_ids.shape)
  return generate_summaries_with_ids(model, tokenizer, input_ids,summary_max_len=summary_max_len, num_beams=num_beams)


def get_summary(ggg):
  return generate_summary_text(BB_MODEL, BB_TOKENIZER, ggg, 1024, 128, 1)


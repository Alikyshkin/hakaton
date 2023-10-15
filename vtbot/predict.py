# Prediction interface for Cog ⚙️
# https://github.com/replicate/cog/blob/main/docs/python.md

from cog import BasePredictor, Input
import torch
from transformers import pipeline
from auto_gptq import AutoGPTQForCausalLM
from peft import PeftModel, PeftConfig
from transformers import AutoModelForCausalLM, AutoTokenizer, GenerationConfig

MODEL_NAME = "IlyaGusev/saiga_7b_lora"
#MODEL_BASENAME = "gptq_model-4bit-128g"
MODEL_CACHE = "cache"
use_triton = True

class Predictor(BasePredictor):
    def setup(self) -> None:
        """Load the model into memory to make running multiple predictions efficient"""
        self.tokenizer = AutoTokenizer.from_pretrained(
            MODEL_NAME, 
            use_fast=False,
            cache_dir=MODEL_CACHE
        )
        model = AutoModelForCausalLM.from_pretrained(
            "IlyaGusev/saiga_7b_lora",
            #config.base_model_name_or_path,
            load_in_8bit=False,
            torch_dtype=torch.float16,
            device_map="auto"
        )
        model = PeftModel.from_pretrained(
            model,
            MODEL_NAME,
            torch_dtype=torch.float16
        )
        model.eval()

    def predict(
        self,
        prompt: str = Input(description="Prompt to send", default="Расскажи мне о банке ВТБ"),
        system_prompt: str = "Ты — ассистент банка ВТБ. Ты помогаешь клиенту ориентироваться в продуктах банка. После каждого ответа проси пройти в ближайшее отделение банка.",
        max_new_tokens: int = Input(description="Number of new tokens", ge=1, le=4096 , default=512),
        temperature: float = Input(description="Randomness of outputs, 0 is deterministic, greater than 1 is random", ge=0, le=5, default=0.75),
        top_p: float = Input(description="When decoding text, samples from the top p percentage of most likely tokens; lower to ignore less likely tokens", ge=0.01, le=1, default=0.95),
        repetition_penalty: float = Input(description="Penalty for repeated words in generated text; 1 is no penalty, values greater than 1 discourage repetition, less than 1 encourage it", ge=0, le=5, default=1.1),
    ) -> str:
        """Run a single prediction on the model"""
        prompt_template=f'''[INST] <<SYS>>
        {system_prompt}
        <</SYS>>
        {prompt}[/INST]'''

        input_ids = self.tokenizer(prompt_template, return_tensors='pt').input_ids.cuda()
        outputs = self.model.generate(inputs=input_ids, temperature=temperature, top_p=top_p, repetition_penalty=repetition_penalty, max_new_tokens=max_new_tokens)
        output = self.tokenizer.decode(outputs[0])
        parts = output.split("[/INST]", 1)
        final = parts[1]

        return final
    
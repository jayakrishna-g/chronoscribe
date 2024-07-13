from langchain import LLMChain, PromptTemplate
from langchain.chains import (
    MapReduceDocumentsChain,
    ReduceDocumentsChain,
    StuffDocumentsChain,
)
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import ChatGoogleGenerativeAI

MAP_PROMPT_TEMPLATE = """The following is a 5 min-part of a large talk's audio transcript. Some parts of the transcript may be incomplete or missing due to limitations in the audio capture process.
{docs}
Based on the available information, provide a summary of this part of the transcript. Focus on the key points, ideas, and topics discussed. If there are gaps in the transcript, try to infer the missing content based on the context, but avoid making assumptions if the information is crucial and not clearly discernible.
Summary:"""

REDUCE_PROMPT_TEMPLATE = """The following is a set of summaries for different parts of an audio transcript. Keep in mind that some summaries may be based on incomplete or missing information.
{docs}
Consolidate these summaries into a concise overview of the cur 5min transcript. Highlight the main themes, decisions, and action items if there any. If there are inconsistencies or gaps in the summaries, try to reconcile them based on the overall context.
Consolidated Summary:"""


class TranscriptSummarizer:
    def __init__(self):
        self.llm = self._create_llm()
        self.map_chain = self._create_map_chain()
        self.reduce_chain = self._create_reduce_chain()
        self.combine_documents_chain = self._create_combine_documents_chain()
        self.reduce_documents_chain = self._create_reduce_documents_chain()
        self.map_reduce_chain = self._create_map_reduce_chain()

    def _create_llm(self):
        return ChatGoogleGenerativeAI(model="gemini-1.5-flash")  # type: ignore

    def _create_map_chain(self):
        map_prompt = PromptTemplate.from_template(MAP_PROMPT_TEMPLATE)
        return LLMChain(llm=self.llm, prompt=map_prompt)

    def _create_reduce_chain(self):
        reduce_prompt = PromptTemplate.from_template(REDUCE_PROMPT_TEMPLATE)
        return LLMChain(llm=self.llm, prompt=reduce_prompt)

    def _create_combine_documents_chain(self):
        return StuffDocumentsChain(
            llm_chain=self.reduce_chain, document_variable_name="docs"
        )

    def _create_reduce_documents_chain(self):
        return ReduceDocumentsChain(
            combine_documents_chain=self.combine_documents_chain,
            collapse_documents_chain=self.combine_documents_chain,
            token_max=4000,
        )

    def _create_map_reduce_chain(self):
        return MapReduceDocumentsChain(
            llm_chain=self.map_chain,
            reduce_documents_chain=self.reduce_documents_chain,
            document_variable_name="docs",
            return_intermediate_steps=False,
        )

    def _split_text(self, text):
        splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
            chunk_size=4096, chunk_overlap=512
        )
        split_docs = splitter.split_text(text)
        return [Document(page_content=doc) for doc in split_docs]

    def get_summary(self, transcript):
        docs = self._split_text(transcript)
        return self.map_reduce_chain.invoke(docs).get("output_text", "")

    @staticmethod
    def instance():
        if globals().get("TRANSCRIPT_SUMMARIZER_INSTANCE") is None:
            globals()["TRANSCRIPT_SUMMARIZER_INSTANCE"] = TranscriptSummarizer()
        return globals()["TRANSCRIPT_SUMMARIZER_INSTANCE"]

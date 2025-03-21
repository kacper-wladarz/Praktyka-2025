import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import OpenAI from 'openai';
import { encoding_for_model, TiktokenModel } from 'tiktoken';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ChatsService {
  private openAIClient;
  private openAIModel: TiktokenModel = 'gpt-4o';
  private enc = encoding_for_model(this.openAIModel);

  constructor(
    private readonly prisma: PrismaService,
    private configService: ConfigService,
    private readonly i18n: I18nService,
  ) {
    this.openAIClient = new OpenAI({
      baseURL: 'https://models.inference.ai.azure.com',
      apiKey: this.configService.get('OPEN_AI_KEY'),
    });
  }

  private openAICountTokens(text) {
    return this.enc.decode(text).length;
  }

  private async isExist(name: string, folderId: string | null, userId: string) {
    const isExist = await this.prisma.chat.findMany({
      where: { AND: [{ name }, { folderId }, { userId }] },
    });

    if (isExist.length > 0) {
      throw new ConflictException(this.i18n.t('chats.error.chatExists'));
    }
  }

  async getRootChats(userId: string) {
    const chats = await this.prisma.chat.findMany({
      where: { AND: [{ userId }, { folderId: null }] },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true },
    });
    return { chats };
  }

  async createRootChat(userId: string, name: string) {
    await this.isExist(name, null, userId);
    const chat = await this.prisma.chat.create({
      data: { userId, name },
      select: { id: true, name: true },
    });
    return { chat };
  }

  async createChat(userId: string, name: string, folderId: string) {
    await this.isExist(name, folderId, userId);
    const chat = await this.prisma.chat.create({
      data: { userId, name, folderId },
    });
    return { chat: { ...chat, type: 'CHAT' } };
  }

  async getMessages(chatId: string) {
    const messages = await this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        body: true,
        userId: true,
      },
    });
    return { messages };
  }

  async createMessage(userId: string, chatId: string, question: string) {
    const message = await this.prisma.message.create({
      data: { body: question, userId, chatId },
      select: { id: true, body: true, userId: true },
    });

    if (!message)
      throw new InternalServerErrorException(
        this.i18n.t('chats.error.creatingError'),
      );
    return { message };
  }

  async generateAnswer(userId: string, chatId: string, messageId: string) {
    const question = await this.prisma.message.findUnique({
      where: { userId, id: messageId, chatId },
      select: { body: true },
    });
    if (!question) {
      throw new NotFoundException(this.i18n.t('chats.error.questionNotFound'));
    }

    const messages = await this.prisma.message.findMany({
      where: { chatId },
      select: { body: true, userId: true },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const convertedMessages = messages.map((message) => ({
      role: message.userId ? 'user' : 'assistant',
      content: message.body,
    }));

    let selectedMessages: { role: string; content: string }[] = [];
    let totalTokens = 0;

    for (let i = convertedMessages.length - 1; i >= 0; i--) {
      const tokensInMessage =
        this.openAICountTokens(convertedMessages[i].role) +
        this.openAICountTokens(convertedMessages[i].content);

      if (totalTokens + tokensInMessage > 8000) {
        break;
      }
      totalTokens += tokensInMessage;
      selectedMessages.push(convertedMessages[i]);
    }

    if (selectedMessages[selectedMessages.length - 1].role === 'user') {
      selectedMessages.pop();
    }
    const openAIData = await this.openAIClient.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'Odpowiadaj na wszystkie pytania w sposób dokładny i szczegółowy',
        },
        ...selectedMessages.reverse(),
        { role: 'user', content: question.body },
      ],
      model: this.openAIModel,
      temperature: 1,
      max_tokens: 4096,
      top_p: 1,
      frequency_penalty: 0.4,
    });
    const response = openAIData.choices[0].message.content;
    if (!response)
      throw new InternalServerErrorException(
        this.i18n.t('chats.error.generatingAnswerError'),
      );

    const answer = await this.prisma.message.create({
      data: { body: response, userId: null, chatId },
      select: { id: true, body: true, userId: true },
    });

    return { answer };
  }

  async deleteChat(id: string, userId: string) {
    const deleted = await this.prisma.chat.delete({ where: { userId, id } });
    const opened = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { lastOpenedChat: true },
    });
    if (opened) {
      if (deleted.id === opened.lastOpenedChat) {
        await this.prisma.user.update({
          where: { id: userId },
          data: { lastOpenedChat: null },
        });
        return { close: true };
      }
    }
    return { close: false };
  }
}

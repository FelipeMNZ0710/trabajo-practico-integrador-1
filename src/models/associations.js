import User from './User.js';
import Profile from './Profile.js';
import Article from './Article.js';
import Tag from './Tag.js';
import ArticleTag from './ArticleTag.js';

User.hasOne(Profile, {
  foreignKey: 'user_id',
  as: 'profile' 
});

Profile.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user' 
});

User.hasMany(Article, {
  foreignKey: 'user_id',
  as: 'articles' 
});

Article.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'author' 
});

Article.belongsToMany(Tag, {
  through: ArticleTag, 
  foreignKey: 'article_id',
  as: 'tags' 
});

Tag.belongsToMany(Article, {
  through: ArticleTag, 
  foreignKey: 'tag_id',
  as: 'articles' 
});

ArticleTag.belongsTo(Article, { foreignKey: 'article_id' });
ArticleTag.belongsTo(Tag, { foreignKey: 'tag_id' });
Article.hasMany(ArticleTag, { foreignKey: 'article_id' });
Tag.hasMany(ArticleTag, { foreignKey: 'tag_id' });
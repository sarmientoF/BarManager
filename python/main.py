# 備考１(行番号)	備考２(顧客番号)	表示名	ﾌﾘｶﾞﾅ(顧客)	ﾌﾘｶﾞﾅ(会社)	会社名	ボトル1	ボトル1番号	ボトル2	ボトル2番号	ボトル3	ボトル3番号
# 1	3	相田  得皓	ｱｲﾀﾞ　ﾄｸﾋﾛ	ｱｲﾀﾞｳﾝﾕ	相田運輸㈱
# 2	4	青木  道男	ｱｵｷ　ﾐﾁｵ	ｱｵｷﾓｸｻﾞｲ	青木木材㈱

# Open data.xlsx file
import pandas as pd

dfs = pd.read_excel("data.xlsx", sheet_name=None)

